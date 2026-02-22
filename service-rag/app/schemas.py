from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    intent: str | None = None
    providers: list[dict] | None = None
    conversation_id: str | None = None


class IntentClassifyRequest(BaseModel):
    message: str


class IntentClassifyResponse(BaseModel):
    intent: str
    confidence: float
    entities: dict = {}


class HealthResponse(BaseModel):
    status: str
    service: str
