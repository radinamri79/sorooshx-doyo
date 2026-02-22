import json
from openai import AsyncOpenAI

from app.config import settings
from app.prompts import SYSTEM_PROMPT, TOOLS


class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    async def chat_completion(self, messages: list[dict], use_tools: bool = True) -> dict:
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1024,
        }

        if use_tools:
            kwargs["tools"] = TOOLS
            kwargs["tool_choice"] = "auto"

        response = await self.client.chat.completions.create(**kwargs)
        return response

    async def get_reply_with_tools(self, messages: list[dict], tool_handler) -> str:
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

        response = await self.chat_completion(full_messages)
        message = response.choices[0].message

        while message.tool_calls:
            full_messages.append(message.model_dump())

            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)

                result = await tool_handler(function_name, arguments)

                full_messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result),
                })

            response = await self.chat_completion(full_messages, use_tools=True)
            message = response.choices[0].message

        return message.content or ""
