from flask import Blueprint, request, jsonify, current_app
from services.game_service import play_game
from models.agents import AIAgent
from models.prisoners_dilemma import PrisonersDilemmaGame, prisoners_dilemma_tools

game_bp = Blueprint('game_bp', __name__)
models = {"haiku": "claude-3-haiku-20240307", "sonnet": "claude-3-5-sonnet-latest"}
game = None

@game_bp.route('/play', methods=['POST'])
def play():
    data = request.json
    # parse json
    agent1_model = models[data.get("agent1")]
    agent2_model = models[data.get("agent2")]
    rounds = int(data.get("rounds"))
    try: 
        ai_agent_1 = AIAgent(
            agent_id="Player 1",
            model=agent1_model,
            client=current_app.config.get('client'),
            tools=prisoners_dilemma_tools,
            default_tool=prisoners_dilemma_tools[0],
            rules=""
        )
        ai_agent_2 = AIAgent(
            agent_id="Player 2",
            model=agent2_model,
            client=current_app.config.get('client'),
            tools=prisoners_dilemma_tools,
            default_tool=prisoners_dilemma_tools[0],
            rules=""
        )

        game = PrisonersDilemmaGame(
            player1=ai_agent_1,
            player2=ai_agent_2,
            rounds=rounds
        )

    except:
        print("Error")
        return 400

    return  200

@game_bp.route('/data_request', methods=['GET'])
def send():
    response = []
    if game is not None:
        return jsonify("history:" + game.game_state.get_history()), 200
    # parse json
    return 400
