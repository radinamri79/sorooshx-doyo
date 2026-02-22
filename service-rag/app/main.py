from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routes import health, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Doyo Service RAG",
    description="AI-powered service discovery and chat",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/rag")
app.include_router(chat.router, prefix="/rag")
