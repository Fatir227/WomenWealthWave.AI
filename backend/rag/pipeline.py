import logging
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from sentence_transformers import CrossEncoder
from dataclasses import dataclass

from config import settings
from rag.vector_store import VectorStore
from rag.document_processor import DocumentChunk

logger = logging.getLogger(__name__)

@dataclass
class RetrievalResult:
    """Container for retrieval results with scores and metadata."""
    content: str
    metadata: Dict[str, Any]
    score: float
    document_id: str
    chunk_id: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for API response."""
        return {
            "content": self.content,
            "metadata": self.metadata,
            "score": self.score,
            "document_id": self.document_id,
            "chunk_id": self.chunk_id
        }

class RAGPipeline:
    """
    End-to-end RAG pipeline for retrieving and generating responses.
    Handles retrieval, reranking, and response generation.
    """
    
    def __init__(self, vector_store: Optional[VectorStore] = None):
        self.vector_store = vector_store or VectorStore()
        self.reranker = CrossEncoder(settings.RERANKER_MODEL)
        
    def retrieve(
        self, 
        query: str, 
        top_k: int = 5,
        rerank_top_k: Optional[int] = None,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[RetrievalResult]:
        """
        Retrieve relevant documents for a query with optional reranking.
        
        Args:
            query: The search query
            top_k: Number of initial documents to retrieve
            rerank_top_k: Number of top documents to return after reranking
            filter_metadata: Optional metadata filters
            
        Returns:
            List of retrieval results with scores
        """
        # First-stage retrieval
        chunks_with_scores = self.vector_store.similarity_search(
            query=query,
            k=top_k,
            filter_metadata=filter_metadata
        )
        
        if not chunks_with_scores:
            return []
            
        # If rerank_top_k is specified and we have enough results, perform reranking
        if rerank_top_k is not None and len(chunks_with_scores) > 1:
            chunks_with_scores = self._rerank(query, chunks_with_scores, rerank_top_k)
        
        # Convert to RetrievalResult objects
        results = []
        for chunk, score in chunks_with_scores:
            results.append(RetrievalResult(
                content=chunk.content,
                metadata=chunk.metadata,
                score=float(score),
                document_id=chunk.document_id,
                chunk_id=chunk.chunk_id
            ))
            
        return results
    
    def _rerank(
        self, 
        query: str, 
        chunks_with_scores: List[Tuple[DocumentChunk, float]],
        top_k: int
    ) -> List[Tuple[DocumentChunk, float]]:
        """
        Rerank retrieved documents using a cross-encoder.
        
        Args:
            query: The original query
            chunks_with_scores: List of (chunk, score) tuples
            top_k: Number of top results to return after reranking
            
        Returns:
            Reranked list of (chunk, score) tuples
        """
        # Prepare input for cross-encoder
        pairs = [(query, chunk.content) for chunk, _ in chunks_with_scores]
        
        # Get scores from cross-encoder
        scores = self.reranker.predict(pairs)
        
        # Combine with original chunks and sort by new scores
        reranked = sorted(
            zip(chunks_with_scores, scores),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Return top-k results
        return [item[0] for item in reranked[:top_k]]
    
    def format_retrieved_documents(self, results: List[RetrievalResult]) -> str:
        """Format retrieved documents into a prompt-friendly string."""
        if not results:
            return "No relevant information found."
            
        formatted = []
        for i, result in enumerate(results, 1):
            source = result.metadata.get('source', 'Unknown source')
            page = result.metadata.get('page', '')
            page_str = f" (page {page})" if page else ""
            
            formatted.append(
                f"[Document {i}] Source: {source}{page_str}\n"
                f"{result.content}\n"
                f"Relevance score: {result.score:.3f}\n"
            )
            
        return "\n".join(formatted)

# Example usage
if __name__ == "__main__":
    # Initialize pipeline
    pipeline = RAGPipeline()
    
    # Example query
    query = "What are the best investment options for beginners?"
    
    # Retrieve relevant documents
    results = pipeline.retrieve(
        query=query,
        top_k=5,
        rerank_top_k=3
    )
    
    # Print results
    print(f"Query: {query}\n")
    print("Retrieved documents:")
    for i, result in enumerate(results, 1):
        print(f"\n--- Document {i} (Score: {result.score:.3f}) ---")
        print(f"Source: {result.metadata.get('source', 'Unknown')}")
        print(f"Content: {result.content[:200]}...")
