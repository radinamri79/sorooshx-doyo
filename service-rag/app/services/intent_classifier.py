from openai import AsyncOpenAI

from app.config import settings
from app.schemas import IntentClassifyResponse


INTENTS = [
    "find_provider",
    "browse_categories",
    "place_order",
    "check_order_status",
    "general_question",
    "greeting",
    "other",
]


class IntentClassifier:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def classify(self, message: str) -> IntentClassifyResponse:
        prompt = f"""Classify the following user message into one of these intents:
{', '.join(INTENTS)}

Also extract any relevant entities (category, city, provider_name).

Message: "{message}"

Respond in JSON format:
{{"intent": "...", "confidence": 0.0-1.0, "entities": {{}}}}
"""
        response = await self.client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=200,
            response_format={"type": "json_object"},
        )

        import json
        result = json.loads(response.choices[0].message.content)

        return IntentClassifyResponse(
            intent=result.get("intent", "other"),
            confidence=result.get("confidence", 0.5),
            entities=result.get("entities", {}),
        )
