import os

from flask import Flask
from flask_cors import CORS

from models.agents import AIAgent, AlwaysDefectAgent
from models.models import AnthropicModel
from models.prisoners_dilemma import prisoners_dilemma_tools, PrisonersDilemmaGame
from routes.game_routes import game_bp


app = Flask(__name__)
CORS(app)
app.register_blueprint(game_bp)

models = {"haiku": "claude-3-haiku-20240307", "sonnet": "claude-3-5-sonnet-latest", "gemini": "gemini-1.5-flash"}


if __name__ == "__main__":
    app.run(debug=True)

    # ai_agent = AIAgent(
    #     agent_id="Player 1",
    #     model=AnthropicModel(name = models["haiku"], system_instruction = PrisonersDilemmaGame.game_rules("Player 1"), api_key = os.getenv("ANTHROPIC_API_KEY")),
    #     tools=prisoners_dilemma_tools,
    #     default_tool=prisoners_dilemma_tools[0],
    # )
    #
    # # random_agent = RandomAgent(agent_id="Random", actions=["cooperate", "defect"])
    #
    #
    # always_defect_agent = AlwaysDefectAgent(agent_id="Always Defect")
    #
    # game = PrisonersDilemmaGame(
    #     player1=ai_agent,
    #     player2=always_defect_agent,
    #     rounds=5,
    # )
    #
    # game.play()
