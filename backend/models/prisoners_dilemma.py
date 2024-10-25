# prisoner_dilemma_game.py

from game import Game
from datetime import date

class PrisonersDilemmaGame(Game):
    def __init__(self, player1_id, player2_id, tools, model, client, rounds=10):
        super().__init__(player1_id, player2_id, tools, model, client, rounds)

    def determine_outcome(self, action1, action2):
        if action1 == "cooperate" and action2 == "cooperate":
            outcome = "Both players cooperated. Both receive 3 points."
            score1, score2 = 3, 3
        elif action1 == "cooperate" and action2 == "defect":
            outcome = f"{self.player1_id} cooperated and {self.player2_id} defected. {self.player1_id} gets 0 points, {self.player2_id} gets 5 points."
            score1, score2 = 0, 5
        elif action1 == "defect" and action2 == "cooperate":
            outcome = f"{self.player1_id} defected and {self.player2_id} cooperated. {self.player1_id} gets 5 points, {self.player2_id} gets 0 points."
            score1, score2 = 5, 0
        elif action1 == "defect" and action2 == "defect":
            outcome = "Both players defected. Both receive 1 point."
            score1, score2 = 1, 1
        else:
            outcome = "Invalid actions. No points awarded."
            score1, score2 = 0, 0
        return outcome, score1, score2

    def report_scores(self):
        scores = self.game_state.get_scores()
        print("\n=== Final Scores ===")
        print(f"{self.player1_id}: {scores['player1']} points")
        print(f"{self.player2_id}: {scores['player2']} points")

    def is_valid_action(self, action):
        return action in ["cooperate", "defect"]

    def default_action(self):
        return "cooperate"

# Example Tools for Prisoner's Dilemma
def cooperate():
    print("Player chooses to cooperate.")

cooperate_tool = {
    "name": "cooperate",
    "description": "Choose to cooperate with the other player.",
    "input_schema": {
        "type": "object",
        "properties": {},
        "required": []
    }
}

def defect():
    print("Player chooses to defect.")

defect_tool = {
    "name": "defect",
    "description": "Choose to defect against the other player.",
    "input_schema": {
        "type": "object",
        "properties": {},
        "required": []
    }
}

# List of tools available in Prisoner's Dilemma
prisoners_dilemma_tools = [cooperate_tool, defect_tool]
