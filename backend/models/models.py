from abc import ABC, abstractmethod
from typing import List
import anthropic
import google.generativeai as genai
from google.protobuf.json_format import MessageToDict

class ToolParameter:
    def __init__(self, name: str, type: str, description: str):
        self.name = name
        self.type = type
        self.description = description

class Tool:
    def __init__(self, name: str, description: str, parameters: List[ToolParameter]):
        self.name = name
        self.description = description
        self.parameters = parameters

class ToolAction:
    def __init__(self, name: str, parameters: dict[str, str]):
        self.name = name
        self.parameters = parameters

    def __str__(self) -> str:
        params_str = ', '.join([f"{key}={value}" for key, value in self.parameters.items()])
        return f"{self.name}({params_str})"

class LLMModel(ABC):
    def __init__(self, provider: str, name: str, system_instruction: str, api_key: str):
        if not name:
            raise ValueError("The 'name' parameter cannot be an empty string.")
        if not api_key:
            raise ValueError("The 'api_key' parameter cannot be an empty string.")
        
        self.provider = provider
        self.name = name
        self.system_instruction = system_instruction
        self.api_key = api_key
        self.messages = []
    
    @abstractmethod
    def generate(self, content: str, tools: list[Tool]) -> ToolAction:
        pass
    
    @abstractmethod
    def convert_to_native_tool_call(self, tools : list[Tool]) -> dict:
        pass

class GeminiModel(LLMModel):
    def __init__(self, name: str, system_instruction: str, api_key: str, temperature = 0.7, max_tokens = 200):
        super().__init__(provider="Google", name=name, system_instruction=system_instruction, api_key=api_key)
        genai.configure(api_key=self.api_key)
        self.temperature = temperature
        self.max_tokens = max_tokens

    def generate(self, content: str, tools: list[Tool]) -> ToolAction:
        self.messages.append({"role": "user", "parts": str(content)})
        response = genai.GenerativeModel(self.name, system_instruction=self.system_instruction).generate_content(
        contents=self.messages,
        generation_config= {"max_output_tokens": self.max_tokens, "temperature": self.temperature},
        tools=GeminiModel.convert_to_native_tool_call(tools),
        tool_config= {
            "function_calling_config": {
                "mode": "ANY",
            },
        })
        self.messages.append(response)
        action = response.candidates[0].content.parts[0].function_call.name.strip().lower()
        arguments = [i for i in response.candidates[0].content.parts[0].function_call.args]
        values = [response.candidates[0].content.parts[0].function_call.args[j] for j in arguments]
        return ToolAction(action, {argument: value for argument, value in zip(arguments, values)})

    def convert_to_native_tool_call(tools: List[Tool]):
        gemini_tools = []
        for tool in tools:
            properties = {
                parameter.name: {
                    "type": str.upper(parameter.type),
                    "description": parameter.description
                }
                for parameter in tool.parameters
            }
            required_parameters = [parameter.name for parameter in tool.parameters]
            gemini_tool = {
                "name": tool.name,
                "description": tool.description,
                "parameters": {
                    "type": "OBJECT",
                    "properties": properties,
                    "required": required_parameters
                }
            }
            gemini_tools.append(gemini_tool)
        return gemini_tools


class AnthropicModel(LLMModel):
    def __init__(self, name: str, system_instruction: str, api_key: str):
        super().__init__(provider="Anthropic", name=name, system_instruction=system_instruction, api_key=api_key)

    def generate(self, content: str, tools: list):
        # Implement the generate method specific to AnthropicModel
        pass