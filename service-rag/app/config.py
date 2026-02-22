from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    backend_url: str = "http://backend:8000"
    database_url: str = "postgresql://doyo:doyo@db:5432/doyo"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost"]

    class Config:
        env_file = ".env"


settings = Settings()
