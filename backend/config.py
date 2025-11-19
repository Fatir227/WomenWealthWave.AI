import os
from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "FinLitAI Backend"
    DEBUG: bool = True
    VERSION: str = "1.0.0"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    RELOAD: bool = True
    
    # Paths
    BASE_DIR: Path = Path(__file__).parent
    DATA_DIR: Path = BASE_DIR / "data"
    VECTOR_DB_PATH: Path = DATA_DIR / "chroma_db"
    KNOWLEDGE_BASE_DIR: Path = DATA_DIR / "knowledge_base"
    
    # Model Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    RERANKER_MODEL: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"
    # Using a smaller model that's more suitable for most systems
    LLM_MODEL: str = "gpt2"  # Using a smaller model for testing
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "deepseek-r1:1.5b")
    
    # Device settings
    DEVICE: str = "cpu"  # Default to CPU to avoid CUDA memory issues
    
    # Model loading settings - disable quantization for the smaller model
    LOAD_IN_8BIT: bool = False  # Disable 8-bit for smaller model
    LOAD_IN_4BIT: bool = False  # Disable 4-bit for smaller model
    DEVICE_MAP: str = "auto"  # Let accelerate handle device placement
    
    # Offloading settings
    OFFLOAD_FOLDER: str = "./model_offload"  # Directory to offload model weights
    OFFLOAD_STATE_DICT: bool = False  # Whether to offload the state dict to CPU
    
    # RAG Configuration
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K_RETRIEVAL: int = 5
    RERANK_TOP_K: int = 3
    
    # API Configuration
    API_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Initialize settings
settings = Settings()

# Create necessary directories
os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(settings.VECTOR_DB_PATH, exist_ok=True)
os.makedirs(settings.KNOWLEDGE_BASE_DIR, exist_ok=True)
