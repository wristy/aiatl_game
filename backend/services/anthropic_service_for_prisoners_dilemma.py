import anthropic
import os

API_KEY = os.getenv("ANTHROPIC_API_KEY")
API_URL = "https://api.anthropic.com/v1/messages"



def get_agent_decision(game_parameters, agent):
    client = anthropic.Client(api_key=API_KEY)
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

