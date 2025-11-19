from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from pathlib import Path
import logging

from config import settings
from api.v1 import api_router  # Updated import path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_application():
    """Initialize application components."""
    # Import here to avoid circular imports
    from rag.vector_store import VectorStore
    
    try:
        # This will create the collection if it doesn't exist
        logger.info("Initializing database...")
        vector_store = VectorStore()
        stats = vector_store.get_collection_stats()
        logger.info(f"Database initialized. Collection stats: {stats}")
        return True
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        return False

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Financial Literacy AI Agent",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Initialize application components on startup
@app.on_event("startup")
async def startup_event():
    if not initialize_application():
        logger.error("Failed to initialize application components")
        # Don't raise here to allow the application to start for debugging
        # In production, you might want to fail fast

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        workers=settings.WORKERS
    )
