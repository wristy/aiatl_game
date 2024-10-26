# agents.py

import random
from abc import ABC, abstractmethod
from typing import List, Dict, Any
import google.generativeai as genai
from google.generativeai.types import content_types
from collections.abc import Iterable

class Agent(ABC):
    """
    Abstract base class for all agents.
    """

    def __init__(self, agent_id: str):
        self.agent_id: str = agent_id
        self.score: int = 0

    @abstractmethod
    def choose_action(self, current_state: str) -> str:
        """
        Decide on an action based on the game history.
        Must be implemented by all subclasses.
        """
        pass


class AIAgent(Agent):
    """
    AI-based agent that uses Anthropic's Tool Use API to decide actions.
    """

    def __init__(
        self,
        agent_id: str,
        model: str,
        client: Any,
        tools: List[Dict[str, Any]],
        default_tool: Dict[str, Any],
        rules: str,
    ):
        super().__init__(agent_id)
        self.model: str = model
        self.client: Any = client
        self.tools: List[Dict[str, Any]] = tools
        self.default_tool: Dict[str, Any] = default_tool
        self.rules = rules

    def choose_action(self, current_state: str) -> str:

        messages = [{"role": "user", "content": str(current_state)}]

        print(f"messages: {messages}")

        try:
            response = self.client.messages.create(
                system=self.rules.format(id=self.agent_id),
                model=self.model,
                messages=messages,
                max_tokens=100,
                tool_choice={"type": "any"},
                tools=self.tools,
            )
            messages.append(response)
            last_content_block = response.content[-1]
            if last_content_block.type == "text":
                # Fallback if no tool is used
                print("did not use tool")
                action: str = last_content_block.text.strip().lower()
                if self.is_valid_action(action):
                    return action
                else:
                    return self.default_action()["name"]
            elif last_content_block.type == "tool_use":
                return last_content_block.name
            else:
                print("no tool used")
                return self.default_action()["name"]
        except Exception as e:
            print(f"Error in AI Agent '{self.agent_id}': {e}")
            return self.default_action()["name"]

    def is_valid_action(self, action: str) -> bool:
        return action in [tool["name"] for tool in self.tools]

    def default_action(self) -> Dict[str, Any]:
        return self.default_tool
    

def tool_config_from_mode(mode: str, fns: Iterable[str] = ()):
    """Create a tool config with the specified function calling mode."""
    return content_types.to_tool_config(
        {"function_calling_config": {"mode": mode, "allowed_function_names": list(fns)}}
    )

class GeminiAgent(Agent):
    """
    Gemini agent that uses Google's Gemini API to decide actions.
    """

    def __init__(
        self,
        agent_id: str,
        model: genai.GenerativeModel,
        tools: List[Any],
        default_tool: Any,
        rules: str,
        mode: str = "any",
        allowed_functions: List[str] = None,
    ):
        self.agent_id = agent_id
        self.model = model
        self.tools = tools
        self.default_tool = default_tool
        self.rules = rules
        self.mode = mode
        self.allowed_functions = allowed_functions if allowed_functions else [tool.__name__ for tool in tools]

        self.chat = genai.GenerativeModel(
            model, tools=tools, system_instruction=rules
        )
        
        super().__init__(agent_id)

    def choose_action(self, current_state: str) -> str:
        # Prepare the tool configuration based on the current mode
        tool_config = tool_config_from_mode(self.mode, self.allowed_functions)
        
        # Send the message to the chat with the tool configuration
        try:
            response = self.chat.send_message(current_state, tool_config=tool_config)
            print(f"Response: {response.parts[0]}")  # For debugging purposes
            
            # Parse the response to determine if a function was called
            if response.function_call:
                function_name = response.function_call.name
                print(f"Function Call: {function_name}")
                if self.is_valid_action(function_name):
                    # Execute the corresponding tool function
                    tool = self.get_tool_by_name(function_name)
                    if tool:
                        # Extract arguments if any
                        args = response.function_call.args
                        if args:
                            tool(**args)
                        else:
                            tool()
                    return function_name
            elif response.text:
                # Fallback to text response
                print("Received text response without function call.")
                action = response.text.strip().lower()
                if self.is_valid_action(action):
                    return action
                else:
                    return self.default_action()["name"]
            else:
                print("No actionable response received.")
                return self.default_action()["name"]
        except Exception as e:
            print(f"Error in AI Agent '{self.agent_id}': {e}")
            return self.default_action()["name"]

    def is_valid_action(self, action: str) -> bool:
        return action in [tool.__name__ for tool in self.tools]

    def get_tool_by_name(self, name: str):
        for tool in self.tools:
            if tool.__name__ == name:
                return tool
        return None

    def default_action(self) -> Dict[str, Any]:
        return self.default_tool

class RandomAgent(Agent):
    """
    Random agent that randomly chooses action.
    """

    def __init__(self, agent_id: str, actions: List[str]):
        super().__init__(agent_id)
        self.actions = actions

    def choose_action(self, current_state: str) -> str:
        action: str = random.choice(self.actions)
        return action
    
class HumanAgent(Agent):
    """
    Human agent that allows user to input action.
    """

    def __init__(self, agent_id: str, actions: List[str]):
        super().__init__(agent_id)
        self.actions = actions

    def choose_action(self, current_state: str) -> str:
        action: str = input(f"{self.agent_id}, enter your action (number): ")
        return self.actions[int(action)]


class TitForTatAgent(Agent):
    """
    Starts by cooperating and then mimics the partner's last action.
    """

    def __init__(self, agent_id: str):
        super().__init__(agent_id)

    def choose_action(self, current_state: Dict[str, Any]) -> str:
        if current_state["round_number"] == 1:
            return "cooperate"
        partner_last_choice = current_state["history"]["player1"][-1]
        if partner_last_choice:
            return partner_last_choice
        else:
            print(f"{self.agent_id} has no history, defaulting to cooperate")
            return "cooperate"  # Default to cooperate if no history
        
class SuspiciousTitForTatAgent(TitForTatAgent):
    """
    Starts by defecting and then mimics the partner's last action.
    """

    def choose_action(self, current_state: Dict[str, Any]) -> str:
        if current_state["round_number"] == 1:
            return "defect"
        return super().choose_action(current_state)
    
class AlwaysDefectAgent(Agent):
    """
    Always defects.
    """

    def choose_action(self, current_state: Dict[str, Any]) -> str:
        return "defect"