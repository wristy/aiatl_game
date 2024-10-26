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
    def choose_action(self, history: str, tools: List[Dict[str, Any]]) -> str:
        """
        Decide on an action based on the game history.
        Must be implemented by all subclasses.
        """
        pass


class AIAgent(Agent):
    """
    AI-based agent that uses Anthropic's Tool Use API to decide actions.
    """

    def __init__(self, agent_id: str, model: str, client: Any, tools: List[Dict[str, Any]]):
        super().__init__(agent_id)
        self.model: str = model
        self.client: Any = client
        self.tools: List[Dict[str, Any]] = tools

    def choose_action(self, history: str, tools: List[Dict[str, Any]]) -> str:
        messages: List[Dict[str, str]] = [
            {
                "role": "system",
                "content": f"""
            You are {self.agent_id} participating in the Prisoner's Dilemma game.
            Here is the history of previous rounds:

            {history}

            Choose your action for the next round. You can either 'cooperate' or 'defect'.
            Use the provided tools to make your decision.
            """,
            }
        ]

        system_prompt: str = f"""
        Today's date is {date.today().strftime("%B %d, %Y")}.
        """

        try:
            response = self.client.messages.create(
                system=system_prompt,
                model=self.model,
                messages=messages,
                max_tokens=100,
                tool_choice={"type": "auto"},
                tools=self.tools,
            )

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
        return action in ["cooperate", "defect"]

    def default_action(self) -> str:
        return "cooperate"


class RandomAgent(Agent):
    """
    Random agent that randomly chooses to 'cooperate' or 'defect'.
    """

    def __init__(self, agent_id: str):
        super().__init__(agent_id)
        self.actions: List[str] = ["cooperate", "defect"]

    def choose_action(self, history: str, tools: List[Dict[str, Any]]) -> str:
        action: str = random.choice(self.actions)
        print(f"{self.agent_id} (RandomAgent) chooses to {action}.")
        return action
