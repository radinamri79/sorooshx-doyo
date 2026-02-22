from app.schemas import ChatRequest, ChatResponse, ChatMessage
from app.services.openai_service import OpenAIService
from app.services.provider_search import ProviderSearch
from app.services.intent_classifier import IntentClassifier


class ChatService:
    def __init__(self):
        self.openai_service = OpenAIService()
        self.provider_search = ProviderSearch()
        self.intent_classifier = IntentClassifier()

    async def process_message(
        self,
        message: str,
        conversation_id: str | None = None,
        history: list[ChatMessage] | None = None,
    ) -> ChatResponse:
        messages = []
        if history:
            for msg in history:
                messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": message})

        intent_result = await self.intent_classifier.classify(message)

        providers = None

        async def tool_handler(function_name: str, arguments: dict):
            nonlocal providers
            if function_name == "search_providers":
                results = await self.provider_search.search_providers(**arguments)
                providers = results
                return results
            elif function_name == "get_categories":
                return await self.provider_search.get_categories()
            return {"error": "Unknown function"}

        reply = await self.openai_service.get_reply_with_tools(messages, tool_handler)

        return ChatResponse(
            reply=reply,
            intent=intent_result.intent,
            providers=providers,
            conversation_id=conversation_id,
        )
