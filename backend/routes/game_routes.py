from flask import Blueprint, request, jsonify
from services.game_service import play_game

game_bp = Blueprint('game_bp', __name__)

@game_bp.route('/play', methods=['POST'])
def play():
    data = request.json
    # parse json
    result = play_game(data)
    return jsonify(result)

@game_bp.route('/data_request', methods=['GET'])
def send():
    response = []
    # parse json
    return jsonify(response)
