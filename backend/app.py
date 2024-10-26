from flask import Flask
from flask_cors import CORS
from models.prisoners_dilemma import PrisonersDilemmaGame, prisoners_dilemma_tools
from routes.game_routes import game_bp
from routes.agent_routes import agent_bp
import anthropic
import os
from models.agents import AIAgent, RandomAgent, TitForTatAgent, SuspiciousTitForTatAgent, AlwaysDefectAgent


app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Client(api_key=API_KEY)

# Register Blueprints
# app.register_blueprint(game_bp, url_prefix='/api/games')
# app.register_blueprint(agent_bp, url_prefix='/api/agents')

models = {"haiku": "claude-3-haiku-20240307", "sonnet": "claude-3-5-sonnet-latest"}


if __name__ == "__main__":
    # app.run(debug=True)

    ai_agent = AIAgent(
        agent_id="LLM",
        model=models["haiku"],
        client=client,
        tools=prisoners_dilemma_tools,
        default_tool=prisoners_dilemma_tools[0],
        rules="",
    )

    random_agent = RandomAgent(agent_id="Random", actions=["cooperate", "defect"])

    tit_for_tat_agent = TitForTatAgent(agent_id="Tit For Tat")

    suspicious_tit_for_tat_agent = SuspiciousTitForTatAgent(agent_id="Suspicious Tit For Tat")

    always_defect_agent = AlwaysDefectAgent(agent_id="Always Defect")

    game = PrisonersDilemmaGame(
        player1=ai_agent,
        player2=always_defect_agent,
        rounds=50,
    )

    game.play()
