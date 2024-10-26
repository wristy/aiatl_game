from abc import ABC, abstractmethod
from datetime import date
from typing import List, Tuple, Dict, Any
from .agents import AIAgent, Agent, RandomAgent





class GameState:
    def __init__(self, current_state: List[str, Any]) -> None:
        self.history: List[Dict[str, Any]] = [current_state]
        self.current_state: Dict[str, Any] = current_state

    def record_game(self, new_state) -> None:
        self.history.append(new_state)
        self.current_state = new_state

    def get_history(self) -> str:
        return str(self.history + "\n")


class Game(ABC):
    def __init__(
        self,
        rules: str,
        start_state: Dict[str, Any],
        player1: Agent,
        player2: Agent,
        rounds: int = 10,
    ) -> None:
        self.rules = rules
        self.player1 = player1
        self.player2 = player2
        self.rounds = rounds
        self.game_state = GameState(start_state)

    @abstractmethod
    def determine_outcome(self, action1: str, action2: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def report_scores(self) -> None:
        pass

    # def agent_decision(self, player_id: str, history: str) -> str:
    #     messages = [
    #         {
    #             "role": "user",
    #             "content": f"""

    #         You are {player_id} participating in the game.
    #         Here is the history of previous rounds:

    #         {history}

    #         Choose your action for the next round. Use the provided tools to make your decision.
    #         """,
    #         }
    #     ]

    #     system_prompt = f"""

    #     """

    #     print(f"{player_id}: ")
    #     response = self.client.messages.create(
    #         system=self.system_prompt,
    #         model=self.model,
    #         messages=messages,
    #         max_tokens=100,
    #         tool_choice={"type": "auto"},
    #         tools=self.tools,
    #     )

    #     print(f"message: {messages}")
    #     last_content_block = response.content[-1]
    #     print(response)
    #     if last_content_block.type == "text":
    #         # Fallback if no tool is used
    #         action = last_content_block.text.strip().lower()
    #         return action if self.is_valid_action(action) else self.default_action()
    #     elif last_content_block.type == "tool_use":
    #         return last_content_block.name
    #     else:
    #         return self.default_action()

    # @abstractmethod
    # def is_valid_action(self, action: str) -> bool:
    #     pass

    # @abstractmethod
    # def default_action(self) -> str:
    #     pass

    def play(self) -> None:
        for round_num in range(1, self.rounds + 1):
            print(f"\n=== Round {round_num} ===")

            # Get current history
            # history = self.game_state.get_history()

            # Get actions from both players
            action1 = self.player1.choose_action(self.game_state.current_state)
            action2 = self.player2.choose_action(self.game_state.current_state)

            print(f"{self.player1.agent_id} chooses to {action1}.")
            print(f"{self.player2.agent_id} chooses to {action2}.")

            # Determine outcome
            new_state = self.determine_outcome(action1, action2)
            print(f"Outcome: {new_state}")

            # Record the game
            self.game_state.record_game(new_state)

        # Final Report
        print("\n=== Game Over ===")
        print(self.game_state.get_history())
        self.report_scores()
