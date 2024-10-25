import requests
import json
import os
from typing import Dict, Any, List
import anthropic

# Load API key from environment variable
API_KEY = os.environ.get("ANTHROPIC_API_KEY")

# API endpoint for Claude with tool use
API_URL = "https://api.anthropic.com/v1/messages"

client = anthropic.Client(api_key=API_KEY)

def send_message(message: str, tools: List[Dict[str, Any]]) -> Dict[str, Any]:
    return client.messages.create(
        model="claude-3-haiku-20240307",
        messages=[{"role": "user", "content": message}],
        max_tokens=1000,
        tools=tools,
        tool_choice={"type": "tool", "name": tools[0]["name"]}
    )

def define_tool(name: str, description: str, parameters: Dict[str, Any], required: List[str]) -> Dict[str, Any]:
    """
    Define a tool for Claude to use.

    Args:
        name (str): The name of the tool.
        description (str): A description of what the tool does.
        parameters (Dict[str, Any]): The parameters the tool accepts.

    Returns:
        Dict[str, Any]: A tool definition.
    """
    return {
        "name": name,
        "description": description,
        "input_schema": {
            "type": "object",
            "properties": parameters,
            "required": required
        }
    }

# Example usage
if __name__ == "__main__":
    # Define a sample tool
    calculator_tool = define_tool(
        name="calculator",
        description="Perform basic arithmetic operations",
        parameters={
            "operation": {"type": "string", "enum": ["add", "subtract", "multiply", "divide"], "description": "The operation to perform"},
            "x": {"type": "number", "description": "The first number"},
            "y": {"type": "number", "description": "The second number"}
        },
        required=["operation", "x", "y"]
    )

    def calculate(operation: str, x: int, y: int) -> int:
        if operation == "add":
            return x + y
        elif operation == "subtract":
            return x - y
        elif operation == "multiply":
            return x * y
        elif operation == "divide":
            return x / y

    user_message = "What's 23413421 multiplied by 1123232? Only respond with the result."
    response = send_message(user_message, [calculator_tool])
    tool_inputs = response.content[0].input
    print(calculate(tool_inputs["operation"], tool_inputs["x"], tool_inputs["y"]))
    
