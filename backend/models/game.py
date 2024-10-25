from abc import ABC, abstractmethod
from datetime import date

class GameState:
    def __init__(self):
        self.history = []  # List of tuples: (player1_action, player2_action, outcome)
        self.scores = {"player1": 0, "player2": 0}

    def record_game(self, action1, action2, outcome, score1, score2):
        self.history.append((action1, action2, outcome))
        self.scores["player1"] += score1
        self.scores["player2"] += score2

    def get_history(self):
        history_str = ""
        for idx, (a1, a2, outcome) in enumerate(self.history, 1):
            history_str += f"Round {idx}:\n  Player 1: {a1}\n  Player 2: {a2}\n  Outcome: {outcome}\n"
        return history_str

    def get_scores(self):
        return self.scores

class Game(ABC):
    def __init__(self, player1_id, player2_id, tools, model, client, rounds=10):
        self.player1_id = player1_id
        self.player2_id = player2_id
        self.tools = tools
        self.model = model
        self.client = client
        self.rounds = rounds
        self.game_state = GameState()

    @abstractmethod
    def determine_outcome(self, action1, action2):
        pass

    @abstractmethod
    def report_scores(self):
        pass

    def agent_decision(self, player_id, history):
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
    def is_valid_action(self, action):
        pass

    @abstractmethod
    def default_action(self):
        pass

    def play(self):
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

