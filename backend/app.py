from flask import Flask
from flask_cors import CORS
from routes.game_routes import game_bp
from routes.agent_routes import agent_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(game_bp, url_prefix='/api/games')
app.register_blueprint(agent_bp, url_prefix='/api/agents')

if __name__ == '__main__':
    app.run(debug=True)
