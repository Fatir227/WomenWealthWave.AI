from typing import Dict, Any, Optional
import logging
from fastapi import HTTPException

from agent.generator import FinancialAgent
from rag.pipeline import RAGPipeline

logger = logging.getLogger(__name__)

class AgentService:
    """Service layer for handling agent operations."""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AgentService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize the agent service with dependencies."""
        try:
            logger.info("Initializing AgentService...")
            rag_pipeline = RAGPipeline()
            self.agent = FinancialAgent(rag_pipeline)
            logger.info("AgentService initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize AgentService: {str(e)}")
            raise
    
    async def process_query(
        self,
        question: str,
        age_group: str,
        region: str,
        language: str = "en",
        **kwargs
    ) -> Dict[str, Any]:
        """
        Process a financial literacy query using the AI agent.
        
        Args:
            question: The user's question
            age_group: User's age group (15-20, 21-28, 29-35)
            region: User's region (india, international)
            language: Preferred language for response
            **kwargs: Additional parameters for the agent
            
        Returns:
            Dictionary containing the agent's response
        """
        try:
            # Validate age group
            if age_group not in ["15-20", "21-28", "29-35"]:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid age group. Must be one of: 15-20, 21-28, 29-35"
                )
            
            # Validate region
            if region not in ["india", "international"]:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid region. Must be one of: india, international"
                )
            
            # Generate response using the agent
            response = self.agent.generate_response(
                query=question,
                age_group=age_group,
                region=region,
                language=language,
                **kwargs
            )
            
            return response
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail="An error occurred while processing your request"
            )
    
    async def health_check(self) -> Dict[str, Any]:
        """Check the health of the agent service."""
        try:
            # Check if the agent is properly initialized
            if not hasattr(self, 'agent') or not self.agent:
                raise Exception("Agent not initialized")
                
            # Perform a simple generation to verify the model is working
            test_response = self.agent.generate_response(
                query="Test health check",
                age_group="21-28",
                region="international",
                max_retrieved_docs=0,
                max_new_tokens=10
            )
            
            return {
                "status": "healthy",
                "model": self.agent.agent.model_name if hasattr(self.agent, 'agent') else "unknown",
                "device": self.agent.agent.device if hasattr(self.agent, 'agent') else "unknown"
            }
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {
                "status": "unhealthy",
                "error": str(e)
            }

# Singleton instance
agent_service = AgentService()
