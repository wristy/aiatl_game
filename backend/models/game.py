import time
from abc import ABC, abstractmethod
from datetime import date
from typing import List, Tuple, Dict, Any
from .agents import AIAgent, Agent, RandomAgent
from .models import ToolAction
from collections import deque
import json

class GameState:
    def __init__(self, current_state: Dict[str, Any]) -> None:
        self.history: Dict[str, List[Any]] = {"player1": [], "player2": []}
        self.current_state: Dict[str, Any] = current_state

    def record_game(self, new_state) -> None:
        self.history['player1'] = new_state['history']['player1']
        self.history['player2'] = new_state['history']['player2']
        self.current_state = new_state

    def get_history(self) -> Dict[str, List[str]]:
        return self.history

    def get_action_history(self) -> Dict[str, List[str]]:
        return {
            "player1": [json.loads(ls)["action"] for ls in self.current_state['history']["player1"]],
            "player2": [json.loads(ls)["action"] for ls in self.current_state['history']["player2"]]
        }
class Game(ABC):
    def __init__(
        self,
        start_state: Dict[str, Any],
        player1: Agent,
        player2: Agent,
        rounds: int = 10,
    ) -> None:
        self.player1 = player1
        self.player2 = player2
        self.rounds = rounds
        self.game_state = GameState(start_state)

    @abstractmethod
    def game_rules(player_id: str) -> str:
        pass

    @abstractmethod
    def determine_outcome(self, action1: ToolAction, action2: ToolAction) -> Dict[str, Any]:
        pass

    @abstractmethod
    def report_scores(self) -> None:
        pass

    def play(self) -> None:
        for round_num in range(1, self.rounds + 1):
            print(f"\n=== Round {round_num} ===")

            # Get current history
            # history = self.game_state.get_history()

            # Get actions from both players
            a1: ToolAction = self.player1.choose_action(json.dumps(self.game_state.get_action_history()))
            a2: ToolAction = self.player2.choose_action(json.dumps(self.game_state.get_action_history()))

            print(f"{self.player1.agent_id} chooses to {a1.name}. Reasoning: {a1.parameters['reasoning']}")
            print(f"{self.player2.agent_id} chooses to {a2.name}. Reasoning: {a2.parameters['reasoning']}")

            # Determine outcome
            new_state = self.determine_outcome(a1, a2)
            # print(f"Outcome: {new_state}")

            # Record the game
            self.game_state.record_game(new_state)
            time.sleep(10)
        # Final Report
        print("\n=== Game Over ===")
        self.report_scores()
