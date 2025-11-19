from typing import List, Dict, Any
from loguru import logger

from app.services.vector_store import vector_store
from app.services.ollama_service import ollama_service

class RAGService:
    def __init__(self):
        self.vector_store = vector_store
        self.llm = ollama_service
    
    async def generate_response(self, query: str, chat_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Generate a response using RAG (Retrieval-Augmented Generation).
        
        Args:
            query: The user's query.
            chat_history: List of previous messages in the conversation.
            
        Returns:
            A dictionary containing the response and relevant context.
        """
        try:
            # 1. Retrieve relevant context from the vector store
            relevant_docs = self.retrieve_relevant_context(query)
            
            # 2. Format the context for the prompt
            context = self._format_context(relevant_docs)
            
            # 3. Generate a response using the LLM with the retrieved context
            response = await self.llm.generate(query, context)
            
            return {
                "response": response,
                "context": relevant_docs,
                "sources": [doc["metadata"].get("source", "") for doc in relevant_docs if doc["metadata"].get("source")]
            }
            
        except Exception as e:
            logger.error(f"Error in RAG pipeline: {str(e)}")
            logger.exception("Full RAG error traceback:")
            raise Exception(f"RAG pipeline error: {str(e)}")
    
    def retrieve_relevant_context(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieve relevant context from the vector store.
        
        Args:
            query: The user's query.
            top_k: Number of relevant documents to retrieve.
            
        Returns:
            List of relevant documents with their metadata and scores.
        """
        try:
            # Get relevant documents from the vector store
            relevant_docs = self.vector_store.search(query, k=top_k)
            
            # Filter out low-quality matches
            relevant_docs = [doc for doc in relevant_docs if doc.get("score", 0) < 0.8]
            
            return relevant_docs
            
        except Exception as e:
            logger.error(f"Error retrieving context: {str(e)}")
            return []
    
    def _format_context(self, documents: List[Dict[str, Any]]) -> str:
        """
        Format the retrieved documents into a context string for the LLM.
        
        Args:
            documents: List of documents with text and metadata.
            
        Returns:
            Formatted context string.
        """
        if not documents:
            return "No context. Use general finance knowledge."
        
        context_parts = []
        
        for i, doc in enumerate(documents, 1):
            # Limit each document to first 500 characters for speed
            text = doc['text'][:500] + "..." if len(doc['text']) > 500 else doc['text']
            source = doc.get("metadata", {}).get("source", "")
            context_parts.append(f"[{source}]: {text}")
        
        return "\n\n".join(context_parts)

# Global instance
rag_service = RAGService()
