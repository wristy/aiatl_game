# agents.py

import random
from abc import ABC, abstractmethod
from datetime import date
from typing import List, Dict, Any, Optional


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

        messages = [{"role": "user", "content": current_state}]

        print(f"messages: {messages}")

        try:
            response = self.client.messages.create(
                system=self.rules.format(id=self.agent_id),
                model=self.model,
                messages=messages,
                max_tokens=100,
                tool_choice={"type": "auto"},
                tools=self.tools,
            )
            messages.append(response)
            last_content_block = response.content[-1]
            if last_content_block.type == "text":
                # Fallback if no tool is used
                action: str = last_content_block.text.strip().lower()
                if self.is_valid_action(action):
                    return action
                else:
                    return self.default_action()["name"]
            elif last_content_block.type == "tool_use":
                return last_content_block.name
            else:
                return self.default_action()["name"]
        except Exception as e:
            print(f"Error in AI Agent '{self.agent_id}': {e}")
            return self.default_action()["name"]

    def is_valid_action(self, action: str) -> bool:
        return action in [tool["name"] for tool in self.tools]

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


class TitForTatAgent(Agent):
    """
    Starts by cooperating and then mimics the partner's last action.
    """

    def __init__(self, agent_id: str):
        super().__init__(agent_id)

    def choose_action(self, current_state: Dict[str, Any]) -> str:
        if current_state["round_number"] == 1:
            return "cooperate"
        partner_last_choice = current_state.get("partner_last_choice")
        if partner_last_choice:
            return partner_last_choice
        else:
            return "cooperate"  # Default to cooperate if no history

