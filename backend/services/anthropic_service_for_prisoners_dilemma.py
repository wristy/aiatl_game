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