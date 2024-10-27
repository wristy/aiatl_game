from flask import Blueprint, request, jsonify, current_app
from services.game_service import play_game
from models.agents import AIAgent
from models.prisoners_dilemma import PrisonersDilemmaGame, prisoners_dilemma_tools
from models.models import GeminiModel, AnthropicModel, LLMModel
import os


game_bp = Blueprint('game_bp', __name__)
models = {"haiku": "claude-3-haiku-20240307", "sonnet": "claude-3-5-sonnet-latest", "gemini": "gemini-1.5-flash"}
game = None

@game_bp.route('/play', methods=['POST'])
def play():
    data = request.json
    # parse json
    agent1_model = models[data.get("agent1")]
    agent2_model = models[data.get("agent2")]
    ai_agent1: LLMModel = None
    ai_agent2: LLMModel = None
    if (agent1_model == models["gemini"]): 
        ai_agent1 = AIAgent(
            agent_id="LLM",
            model=GeminiModel(name = agent1_model, system_instruction = PrisonersDilemmaGame.game_rules(), api_key = os.getenv("GEMINI_API_KEY")),
            tools=prisoners_dilemma_tools,
            default_tool=prisoners_dilemma_tools[0],
        )
    else:
        ai_agent1 = AIAgent(
            agent_id="LLM",
            model=AnthropicModel(name = agent2_model, system_instruction = PrisonersDilemmaGame.game_rules(), api_key = os.getenv("ANTHROPIC_API_KEY")),
            tools=prisoners_dilemma_tools,
            default_tool=prisoners_dilemma_tools[0],
        )

    if (agent2_model == models["gemini"]): 
        ai_agent2 = AIAgent(
            agent_id="LLM",
            model=GeminiModel(name = agent1_model, system_instruction = PrisonersDilemmaGame.game_rules(), api_key = os.getenv("GEMINI_API_KEY")),
            tools=prisoners_dilemma_tools,
            default_tool=prisoners_dilemma_tools[0],
        )
    else:
        ai_agent2 = AIAgent(
            agent_id="LLM",
            model=AnthropicModel(name = agent2_model, system_instruction = PrisonersDilemmaGame.game_rules(), api_key = os.getenv("ANTHROPIC_API_KEY")),
            tools=prisoners_dilemma_tools,
            default_tool=prisoners_dilemma_tools[0],
        )
    rounds = int(data.get("rounds"))
    try: 

        game = PrisonersDilemmaGame(
            player1=ai_agent1,
            player2=ai_agent2,
            rounds=rounds
        )
        

    except Exception as e:
        print(f"Error: {e}")
        return 400

    return  200

@game_bp.route('/data_request', methods=['GET'])
def send():
    response = []
    if game is not None:
        return jsonify("history:" + game.game_state.get_history()), 200
    # parse json
    return 400
