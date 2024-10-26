from flask import Flask
from flask_cors import CORS
from models.prisoners_dilemma import PrisonersDilemmaGame, prisoners_dilemma_tools
from routes.game_routes import game_bp
from routes.agent_routes import agent_bp
import anthropic
import os

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Client(api_key=API_KEY)

# Register Blueprints
# app.register_blueprint(game_bp, url_prefix='/api/games')
# app.register_blueprint(agent_bp, url_prefix='/api/agents')

if __name__ == '__main__':
    # app.run(debug=True)
    game = PrisonersDilemmaGame("player1", "player2", prisoners_dilemma_tools, "claude-3-haiku-20240307", client, rounds=2)
    game.play()

