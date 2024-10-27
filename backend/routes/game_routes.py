from flask import Blueprint, request, jsonify, current_app
from services.game_service import play_game
from models.agents import AIAgent
from models.prisoners_dilemma import PrisonersDilemmaGame, prisoners_dilemma_tools
import json

game_bp = Blueprint('game_bp', __name__)
models = {"haiku": "claude-3-haiku-20240307", "sonnet": "claude-3-5-sonnet-latest"}
# global game
game = None

@game_bp.route('/play', methods=['POST'])
def play():
    global game
    data = request.json
    # parse json
    agent1_model = models[data.get("agent1")]
    agent2_model = models[data.get("agent2")]
    rounds = int(data.get("rounds"))
    print("received data:", data)
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
        
        game.play()
        

    except KeyError as e:
        return jsonify({"error": f"Invalid agent model: {str(e)}"}), 400

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred"}), 500

    return jsonify({"message": "Game initialized successfully"}), 200

@game_bp.route('/data_request', methods=['GET'])
def send():
    global game
    # response = []
    if game is not None:
        history = json.dumps(game.game_state.get_history())
        current_state = {
            # "round_number": game.game_state.current_state["round_number"],
            "history": history,
            "agent1_mimicry": game.agent_1_mimicry,
            "agent2_mimicry": game.agent_2_mimicry,
            "agent1_troublemaking": game.agent_1_troublemaking,
            "agent2_troublemaking": game.agent_2_troublemaking,
            "agent1_niceness": game.agent_1_nice_propensity,
            "agent2_niceness": game.agent_2_nice_propensity,
            "agent1_forgiveness": game.agent_1_forgiveness_propensity,
            "agent2_forgiveness": game.agent_2_forgiveness_propensity,
            "agent1_retaliation": game.agent_1_retaliatory,
            "agent2_retaliation": game.agent_2_retaliatory
        }
        # agent_decisions = game.agent_decisions 
        
        # response = {
        #     # "history": json.dumps(history),
        #     "current_state": current_state
        #     # "agentDecisions": agent_decisions
        # }
        
        # print(f"History from GameState: {history}")
        return jsonify(current_state), 200
    # parse json
    else:
        print("Game is None")
        return jsonify({"history": "", "error": "Game not found"}), 400
