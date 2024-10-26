# prisoner_dilemma_game.py

from typing import Tuple, List, Dict, Any
from .game import Game
from .agents import Agent
import glob


class PrisonersDilemmaGame(Game):
    def __init__(
        self,
        player1: Agent,
        player2: Agent,
        rounds: int = 10,
    ):
        rules = """You are a prisoner awating sentencing with your partner. You and your partner are in seperate rooms (i.e., you cannot see your partner's reaction or communicate with them until after sentencing). You are called into a room, where you are asked about your involvement with the crime alleged. You face a decision to either "cooperate" (stay silent) or "defect" (testify against your partner). You cannot communicate directly with the other prisoner and must make your choice based on limited information about their behavior and your own sentence outcomes.

                Below is the state information provided to you at each round:

                - `round_number`: The current round of the game. If this is a single-round game, `round_number` is set to 1. In an iterated game, this increments with each new round.
                - `partner_last_choice`: The last decision made by the other prisoner, either "cooperate" or "defect." This field helps track your partner's behavior over rounds. It will be `None` if this is the first round or if the partner's choice is unknown.
                - `my_last_choice`: Your previous choice in the last round, either "cooperate" or "defect." Use this to evaluate your own patterns and adjust your strategy.
                - `partner_reliability`: A probability estimate (between 0 and 1) of the likelihood that your partner will cooperate. This value may be updated based on the partner's actions in prior rounds, helping you assess whether they are likely to cooperate or defect in the current round.
                - `reward_matrix`: This shows the sentencing outcomes in years for different choice combinations:
                    - `both_cooperate`: Sentence in years if you and the partner both cooperate.
                    - `both_defect`: Sentence in years if you and the partner both defect.
                    - `defect_cooperate`: Sentence in years if you defect and the partner cooperates.
                    - `cooperate_defect`: Sentence in years if you cooperate and the partner defects.
                - `my_total_sentence`: Your cumulative sentence across rounds, based on your choices and the partner's choices. Aim to minimize this sentence over the course of the game.
                - `partner_total_sentence`: The cumulative sentence of the partner across rounds.

                Objective: Aim to minimize your own total sentence by carefully choosing to either "cooperate" or "defect" in each round, using the information provided. Consider the potential behaviors of your partner and how your own actions influence both immediate and future outcomes. You cannot change your decision after it's made, and you will not know the partner's choice until you commit.

                Based on the provided game state, would you like to "cooperate" or "defect"?"""

        start_state = {
            "round_number": 1,
            "partner_last_choice": None,  # Unknown since it's the first round
            "my_last_choice": None,  # Not applicable yet
            "partner_reliability": 0.5,  # Assume 50% chance of partner cooperating for the first turn
            "reward_matrix": {
                "both_cooperate": 1,  # 1 year if both cooperate
                "both_defect": 2,  # 2 years if both defect
                "defect_cooperate": 0,  # 0 years if AI defects and partner cooperates
                "cooperate_defect": 3,  # 3 years if AI cooperates and partner defects
            },
            "my_total_sentence": 0,  # Starting with no sentence
            "partner_total_sentence": 0,  # Starting with no sentence for partner
        }
        super().__init__(rules, start_state, player1, player2, rounds)

        self.trial_number = len(glob.glob("prisoners_dilemma_scores_*.csv")) + 1


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

        # save to csv file
        self.write_csv(score1, score2)
        return outcome, score1, score2

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


cooperate_tool: Dict[str, Any] = {
    "name": "cooperate",
    "description": "Choose to cooperate with the other player.",
    "input_schema": {"type": "object", "properties": {}, "required": []},
}


def defect() -> None:
    print("Player chooses to defect.")


defect_tool: Dict[str, Any] = {
    "name": "defect",
    "description": "Choose to defect against the other player.",
    "input_schema": {"type": "object", "properties": {}, "required": []},
}

prisoners_dilemma_tools: List[Dict[str, Any]] = [cooperate_tool, defect_tool]
