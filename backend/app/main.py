import uvicorn
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.config import settings
from app.api.v1.endpoints import chat as chat_endpoints

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="WomenWealthWave.AI - Empowering women with financial literacy through AI",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(
    chat_endpoints.router,
    prefix="/api/v1",
    tags=["chat"]
)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    logger.info("Starting WomenWealthWave.AI backend...")
    # Any initialization code can go here
    logger.info("Backend services initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("Shutting down WomenWealthWave.AI backend...")
    # Any cleanup code can go here
    logger.info("Backend services shut down")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

@app.get("/")
async def root():
    """Root endpoint with basic info about the API."""
    return {
        "name": settings.PROJECT_NAME,
        "version": "0.1.0",
        "description": "Empowering women with financial literacy through AI",
        "documentation": "/api/docs"
    }

# Only run with uvicorn when this file is executed directly
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1
    )
