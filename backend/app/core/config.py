import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "WomenWealthWave.AI"
    API_V1_STR: str = "/api/v1"
    
    # ChromaDB Settings
    CHROMA_DB_PATH: str = "data/chroma_db"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"  # Lightweight model for embeddings
    
    # Ollama Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    # Default to a lightweight Qwen model (~1 GB) to keep RAM usage low
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen2:0.5b")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
