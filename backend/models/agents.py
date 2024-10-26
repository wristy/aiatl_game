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
        messages: List[Dict[str, str]] = [
            {
                "role": "user",
                "content": current_state,
            }
        ]

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
                    return self.default_action()
            elif last_content_block.type == "tool_use":
                return last_content_block.name
            else:
                return self.default_action()
        except Exception as e:
            print(f"Error in AI Agent '{self.agent_id}': {e}")
            return self.default_action()

    def is_valid_action(self, action: str) -> bool:
        return action in [tool["name"] for tool in self.tools]

    def default_action(self) -> str:
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
        print(f"{self.agent_id} (RandomAgent) chooses to {action}.")
        return action
