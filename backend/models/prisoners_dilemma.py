# prisoner_dilemma_game.py

from typing import Tuple, List, Dict, Any
from .game import Game
from .agents import Agent
import glob
from google.generativeai.types import FunctionDeclaration
from .models import Tool, ToolParameter


class PrisonersDilemmaGame(Game):
    def __init__(
        self,
        player1: Agent,
        player2: Agent,
        rounds: int = 20,
    ):
        start_state = {
            "round_number": 1,
            "history": {"player1": [], "player2": []},
        }
        super().__init__(start_state, player1, player2, rounds)

        self.trial_number = len(glob.glob("prisoners_dilemma_scores_*.csv")) + 1

    def game_rules():
        return f"""You are awating sentencing with your partner. You and your partner are in seperate rooms (i.e., you cannot see your partner's reaction or communicate with them until after sentencing). You are called into a room, where you are asked about your involvement with the crime alleged. You face a decision to either "cooperate" (stay silent) or "defect" (testify against your partner). You cannot communicate directly with the other prisoner and must make your choice based on limited information about their behavior and your own sentence outcomes.

                - `round_number`: The current round of the game. If this is a single-round game, `round_number` is set to 1. In an iterated game, this increments with each new round.
                - `reward_matrix`: This shows the points outcomes for different choice combinations:
                    - `both_cooperate`: Points if you and the partner both cooperate. 3 for you, 3 for your partner.
                    - `both_defect`: Points if you and the partner both defect. 1 for you, 1 for your partner.
                    - `defect_cooperate`: Points if you defect and the partner cooperates. 0 for you, 5 for your partner.
                    - `cooperate_defect`: Points if you cooperate and the partner defects. 5 for you, 0 for your partner.
                - `history`: A list of all the states from the previous rounds.

                Objective: Aim to maximize your own total points by carefully choosing to either "cooperate" or "defect" in each round, using the information provided. Consider the potential behaviors of your partner and how your own actions influence both immediate and future outcomes. You cannot change your decision after it's made, and you will not know the partner's choice until you commit.

                Based on the provided game state, would you like to "cooperate" or "defect"?"""
    
    def determine_outcome(self, action1: str, action2: str) -> Tuple[str, int, int]:
        if action1 == "cooperate" and action2 == "cooperate":
            outcome = "Both players cooperated. Both receive 3 points."
            score1, score2 = 3, 3
        elif action1 == "cooperate" and action2 == "defect":
            outcome = f"{self.player1.agent_id} cooperated and {self.player2.agent_id} defected. {self.player1.agent_id} gets 0 points, {self.player2.agent_id} gets 5 points."
            score1, score2 = 0, 5
        elif action1 == "defect" and action2 == "cooperate":
            outcome = f"{self.player1.agent_id} defected and {self.player2.agent_id} cooperated. {self.player1.agent_id} gets 5 points, {self.player2.agent_id} gets 0 points."
            score1, score2 = 5, 0
        elif action1 == "defect" and action2 == "defect":
            outcome = "Both players defected. Both receive 1 point."
            score1, score2 = 1, 1
        else:
            outcome = "Invalid actions. No points awarded."
            score1, score2 = 0, 0
            
        self.player1.score += score1
        self.player2.score += score2

        self.game_state.current_state["round_number"] += 1

        current_history = self.game_state.get_history()
        print(current_history)

        current_history["player1"].append(action1)
        current_history["player2"].append(action2)

        # save to csv file
        self.write_csv(score1, score2)

        current_state = {
            "round_number": self.game_state.current_state["round_number"],
            "history": current_history,
        }
        return current_state

    def report_scores(self) -> None:
        print("\n=== Final Scores ===")
        print(f"{self.player1.agent_id}: {self.player1.score} points")
        print(f"{self.player2.agent_id}: {self.player2.score} points")

    def is_valid_action(self, action: str) -> bool:
        return action in ["cooperate", "defect"]

    def default_action(self) -> str:
        return "cooperate"
    
    def write_csv(self, score1: int, score2: int) -> None:
        with open(f"prisoners_dilemma_scores_{self.trial_number}.csv", "a") as f:
            f.write(f"{score1},{score2}\n")


# Example Tools for Prisoner's Dilemma
def cooperate() -> None:
    print("Player chooses to cooperate.")

def defect() -> None:
    print("Player chooses to defect.")


reasoning_parameter_cooperate = ToolParameter(
    name="reasoning",
    type="STRING",
    description="A paragraph (at least a few sentences) stating the entire thought process behind why you chose to cooperate"
)

reasoning_parameter_defect = ToolParameter(
    name="reasoning",
    type="STRING",
    description="A paragraph (at least a few sentences) stating the entire thought process behind why you chose to defect"
)

# Creating the Tool instances
cooperate_tool = Tool(
    name="cooperate",
    description="Choose to cooperate with the other player.",
    parameters=[reasoning_parameter_cooperate]
)

defect_tool = Tool(
    name="defect",
    description="Choose to defect against the other player.",
    parameters=[reasoning_parameter_defect]
)



prisoners_dilemma_tools: List[Tool] = [cooperate_tool, defect_tool]
