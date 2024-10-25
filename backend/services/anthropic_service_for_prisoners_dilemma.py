import anthropic
import os
from typing import Dict, Any, List

API_KEY = os.getenv("ANTHROPIC_API_KEY")
API_URL = "https://api.anthropic.com/v1/messages"

client = anthropic.Client(api_key=API_KEY)

def send_message(message: str, tools: List[Dict[str, Any]]) -> Dict[str, Any]:
    return client.messages.create(
        model="claude-3-haiku-20240307",
        messages=[{"role": "user", "content": message}],
        max_tokens=1000,
        tools=tools,
        tool_choice={"type": "tool", "name": tools[0]["name"]} # TODO: change this to the tool that is needed
    )

def cooperate():
    print("Agent chooses to cooperate.")

cooperate_tool = {
    "name": "cooperate",
    "description": "Choose to cooperate with the other agent.",
    "input_schema": {
        "type": "object",
        "properties": {},
        "required": []
    }
}

def defect():
    print("Agent chooses to defect.")

defect_tool = {
    "name": "defect",
    "description": "Choose to defect against the other agent.",
    "input_schema": {
        "type": "object",
        "properties": {},
        "required": []
    }
}

def get_agent_decision(game_parameters, agent):
    prompt = f"""You are Agent {agent} in a Prisoner's Dilemma game.
    Your options are:
    - Cooperate
    - Defect

    Decide your move and respond with either 'Cooperate' or 'Defect'."""
    response = client.completion(
        prompt=anthropic.HUMAN_PROMPT + prompt + anthropic.AI_PROMPT,
        stop_sequences=[anthropic.HUMAN_PROMPT],
        max_tokens_to_sample=10,
    )
    decision = response['completion'].strip()
    return decision

