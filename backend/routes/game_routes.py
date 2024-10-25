from flask import Blueprint, request, jsonify
from backend.services.game_service import play_game

game_bp = Blueprint('game_bp', __name__)

@game_bp.route('/play', methods=['POST'])
def play():
    data = request.json
    result = play_game(data)
    return jsonify(result)
