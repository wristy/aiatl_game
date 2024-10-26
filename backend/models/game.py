from abc import ABC, abstractmethod
from datetime import date
from typing import List, Tuple, Dict, Any

class GameState:
    def __init__(self) -> None:
        self.history: List[Tuple[str, str, str]] = []  # List of tuples: (player1_action, player2_action, outcome)
        self.scores: Dict[str, int] = {"player1": 0, "player2": 0}

    def record_game(self, action1: str, action2: str, outcome: str, score1: int, score2: int) -> None:
        self.history.append((action1, action2, outcome))
        self.scores["player1"] += score1
        self.scores["player2"] += score2

    def get_history(self) -> str:
        history_str = ""
        for idx, (a1, a2, outcome) in enumerate(self.history, 1):
            history_str += f"Round {idx}:\n  Player 1: {a1}\n  Player 2: {a2}\n  Outcome: {outcome}\n"
        return history_str

    def get_scores(self) -> Dict[str, int]:
        return self.scores

class Game(ABC):
    def __init__(self, player1_id: str, player2_id: str, tools: List[Dict[str, Any]], model: str, client: Any, rounds: int = 10) -> None:
        self.player1_id = player1_id
        self.player2_id = player2_id
        self.tools = tools
        self.model = model
        self.client = client
        self.rounds = rounds
        self.game_state = GameState()

    @abstractmethod
    def determine_outcome(self, action1: str, action2: str) -> Tuple[str, int, int]:
        pass

    @abstractmethod
    def report_scores(self) -> None:
        pass
    
    def agent_decision(self, player_id: str, history: str) -> str:
        messages = [{
            "role": "system",
            "content": f"""
            You are {player_id} participating in the game.
            Here is the history of previous rounds:

            {history}

            Choose your action for the next round. Use the provided tools to make your decision.
            """
        }]

        system_prompt = f"""
        Today's date is {date.today().strftime("%B %d, %Y")}.
        """

        response = self.client.messages.create(
            system=system_prompt,
            model=self.model,
            messages=messages,
            max_tokens=100,
            tool_choice={"type": "auto"},
            tools=self.tools
        )

        last_content_block = response.content[-1]
        if last_content_block.type == "text":
            # Fallback if no tool is used
            action = last_content_block.text.strip().lower()
            return action if self.is_valid_action(action) else self.default_action()
        elif last_content_block.type == "tool_use":
            return last_content_block.tool_name
        else:
            return self.default_action()

    @abstractmethod
    def is_valid_action(self, action: str) -> bool:
        pass

    @abstractmethod
    def default_action(self) -> str:
        pass

    def play(self) -> None:
        for round_num in range(1, self.rounds + 1):
            print(f"\n=== Round {round_num} ===")

            # Get current history
            history = self.game_state.get_history()

            # Get actions from both players
            action1 = self.agent_decision(self.player1_id, history)
            action2 = self.agent_decision(self.player2_id, history)

            print(f"{self.player1_id} chooses to {action1}.")
            print(f"{self.player2_id} chooses to {action2}.")

            # Determine outcome
            outcome, score1, score2 = self.determine_outcome(action1, action2)
            print(f"Outcome: {outcome}")

            # Record the game
            self.game_state.record_game(action1, action2, outcome, score1, score2)

        # Final Report
        print("\n=== Game Over ===")
        print(self.game_state.get_history())
        self.report_scores()