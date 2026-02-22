# Service-RAG — FastAPI AI Microservice

## Tech Stack

- FastAPI + Uvicorn
- OpenAI SDK (GPT-4o with function calling)
- Pydantic v2 + pydantic-settings
- httpx (async HTTP client)
- pgvector + SQLAlchemy (future: vector search)

## Setup (without Docker)

```bash
cd service-rag
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export OPENAI_API_KEY=your-key
export BACKEND_URL=http://localhost:8000

uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## Endpoints

- `GET /rag/health` — Health check
- `POST /rag/chat` — AI chat (sends message, gets AI response)
- `POST /rag/chat/classify-intent` — Intent classification

## AI Tools (Function Calling)

The AI assistant has access to:

- `search_providers` — Search providers by category, city, query
- `get_categories` — List available service categories

## Intents

The intent classifier recognizes:
- `find_provider` — User wants to find a service provider
- `browse_categories` — User wants to see available categories
- `place_order` — User wants to book a service
- `check_order_status` — User asks about order status
- `general_question` — General platform question
- `greeting` — Hello/hi
- `other` — Unrecognized intent

## Testing

```bash
pytest
```
