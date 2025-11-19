from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from pydantic import BaseModel
from loguru import logger

from app.services.rag_service import rag_service

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    chat_history: List[ChatMessage] = []
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []

def is_finance_related(message: str) -> bool:
    """Check if the message is related to finance."""
    # List of finance-related keywords
    finance_keywords = [
        'money', 'finance', 'invest', 'saving', 'budget', 'loan', 'credit', 'bank',
        'insurance', 'tax', 'scheme', 'fund', 'stock', 'mutual', 'sip', 'ppf', 'fd',
        'salary', 'income', 'expense', 'debt', 'emi', 'interest', 'retirement',
        'pension', 'business', 'entrepreneur', 'profit', 'loss', 'account', 'payment',
        'rupee', 'rupees', '₹', 'wealth', 'asset', 'liability', 'financial',
        'gold', 'property', 'real estate', 'crypto', 'trading', 'nps', 'epf'
    ]
    
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in finance_keywords)

@router.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest):
    """
    Handle chat messages and return AI responses with financial literacy support.
    """
    try:
        # Get the latest user message
        user_message = chat_request.message.strip()
        if not user_message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        # Check if question is finance-related
        if not is_finance_related(user_message):
            return ChatResponse(
                response=(
                    "I'm WomenWealthWave, a specialized financial literacy assistant for women. "
                    "I can only help with finance-related topics like:\n\n"
                    "💰 Budgeting and saving\n"
                    "📈 Investing (mutual funds, stocks, SIPs)\n"
                    "🏦 Banking, loans, and credit\n"
                    "🛡️ Insurance and retirement planning\n"
                    "🎯 Government schemes for women\n"
                    "💼 Women's entrepreneurship\n\n"
                    "Please ask me a question about personal finance or financial literacy!"
                ),
                sources=[]
            )
        
        # Generate response using RAG
        result = await rag_service.generate_response(
            query=user_message,
            chat_history=[msg.dict() for msg in chat_request.chat_history]
        )
        
        return ChatResponse(
            response=result["response"],
            sources=result.get("sources", [])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.exception("Full chat endpoint error traceback:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )

# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint for the chat service."""
    return {"status": "ok", "service": "WomenWealthWave.AI Chat"}
