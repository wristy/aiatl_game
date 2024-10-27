import time
from abc import ABC, abstractmethod
from datetime import date
from typing import List, Tuple, Dict, Any
from .agents import AIAgent, Agent, RandomAgent
from collections import deque
import json

class GameState:
    def __init__(self, current_state: Dict[str, Any]) -> None:
        self.history: Dict[str, List[str]] = {"player1": [], "player2": []}
        self.current_state: Dict[str, Any] = current_state

    def record_game(self, new_state) -> None:
        self.history['player1'] = (new_state['history']['player1'])
        self.history['player2'] = (new_state['history']['player2'])
        self.current_state = new_state

    def get_history(self) -> Dict[str, List[str]]:
        return self.history
    
    def get_history_json(self) -> str:
        return json.dumps(self.history)

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


    def play(self) -> None:
        player1_queue = deque(["cooperate", "cooperate", "cooperate", "cooperate", "cooperate", "cooperate", "cooperate", "cooperate", "cooperate", "cooperate"])
        player2_queue = deque(["cooperate", "cooperate", "cooperate", "cooperate", "defect","defect", "cooperate", "cooperate", "defect", "defect"])
        for round_num in range(1, self.rounds + 1):
            print(f"\n=== Round {round_num} ===")

            # Get current history
            # history = self.game_state.get_history()

            # Get actions from both players
            # action1 = self.player1.choose_action(self.game_state.get_history())
            # action2 = self.player2.choose_action(self.game_state.get_history())

            action1 = player1_queue.popleft()
            action2 = player2_queue.popleft()

            print(f"{self.player1.agent_id} chooses to {action1}.")
            print(f"{self.player2.agent_id} chooses to {action2}.")

            # Determine outcome
            new_state = self.determine_outcome(action1, action2)
            print(f"Outcome: {new_state}")

            # Record the game
            self.game_state.record_game(new_state)
            time.sleep(10)
        # Final Report
        print("\n=== Game Over ===")
        self.report_scores()
