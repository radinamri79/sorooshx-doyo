from fastapi import APIRouter, HTTPException

from app.schemas import ChatRequest, ChatResponse, IntentClassifyRequest, IntentClassifyResponse
from app.services.chat_service import ChatService
from app.services.intent_classifier import IntentClassifier

router = APIRouter()
chat_service = ChatService()
intent_classifier = IntentClassifier()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = await chat_service.process_message(
            message=request.message,
            conversation_id=request.conversation_id,
            history=request.history,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/classify-intent", response_model=IntentClassifyResponse)
async def classify_intent(request: IntentClassifyRequest):
    try:
        result = await intent_classifier.classify(request.message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
