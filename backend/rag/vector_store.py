import os
import logging
from typing import List, Dict, Any, Optional, Tuple
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
import numpy as np

from config import settings
from rag.document_processor import DocumentChunk

logger = logging.getLogger(__name__)

class VectorStore:
    """
    Manages vector storage and retrieval using ChromaDB.
    Handles document embeddings, storage, and similarity search.
    """
    
    def __init__(self, collection_name: str = "financial_knowledge"):
        self.collection_name = collection_name
        self.embedding_model = settings.EMBEDDING_MODEL
        self.vector_db_path = settings.VECTOR_DB_PATH
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=str(self.vector_db_path),
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Initialize embedding function
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=self.embedding_model
        )
        
        # Get or create collection
        self.collection = self._get_or_create_collection()
    
    def _get_or_create_collection(self):
        """Get existing collection or create a new one if it doesn't exist."""
        try:
            # First try to get the collection
            try:
                collection = self.client.get_collection(
                    name=self.collection_name,
                    embedding_function=self.embedding_function
                )
                print(f"Found existing collection: {self.collection_name}")
                return collection
            except Exception as e:
                print(f"Collection not found, creating new one: {str(e)}")
                # Collection doesn't exist, create a new one
                collection = self.client.create_collection(
                    name=self.collection_name,
                    embedding_function=self.embedding_function,
                    metadata={"hnsw:space": "cosine"}  # Fixed typo: 'cosme' -> 'cosine'
                )
                print(f"Created new collection: {self.collection_name}")
                return collection
        except Exception as e:
            print(f"Error in _get_or_create_collection: {str(e)}")
            raise
    
    def add_documents(self, chunks: List[DocumentChunk]) -> List[str]:
        """
        Add document chunks to the vector store.
        
        Args:
            chunks: List of DocumentChunk objects to add
            
        Returns:
            List of document IDs that were added
        """
        if not chunks:
            return []
            
        ids = []
        documents = []
        metadatas = []
        
        for chunk in chunks:
            chunk_id = chunk.chunk_id
            ids.append(chunk_id)
            documents.append(chunk.content)
            
            # Prepare metadata
            metadata = chunk.metadata.copy()
            metadata['document_id'] = chunk.document_id
            if chunk.page_number is not None:
                metadata['page'] = chunk.page_number
            if chunk.section is not None:
                metadata['section'] = chunk.section
                
            metadatas.append(metadata)
        
        # Add to collection
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        return ids
    
    def similarity_search(
        self, 
        query: str, 
        k: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[Tuple[DocumentChunk, float]]:
        """
        Search for similar documents to the query.
        
        Args:
            query: The search query
            k: Number of results to return
            filter_metadata: Optional metadata filters
            
        Returns:
            List of (DocumentChunk, similarity_score) tuples
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            where=filter_metadata
        )
        
        chunks = []
        for i in range(len(results['ids'][0])):
            chunk_id = results['ids'][0][i]
            document = results['documents'][0][i]
            metadata = results['metadatas'][0][i]
            distance = results['distances'][0][i]
            
            # Convert distance to similarity score (1.0 - normalized distance)
            # Since Chroma uses cosine distance (0-2), we normalize to 0-1
            similarity = 1.0 - (distance / 2.0)
            
            chunk = DocumentChunk(
                content=document,
                metadata=metadata,
                chunk_id=chunk_id,
                document_id=metadata.get('document_id', ''),
                page_number=metadata.get('page'),
                section=metadata.get('section')
            )
            chunks.append((chunk, similarity))
        
        return chunks
    
    def delete_document(self, document_id: str) -> bool:
        """
        Delete all chunks associated with a document.
        
        Args:
            document_id: ID of the document to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Get all chunks for this document
            results = self.collection.get(
                where={"document_id": document_id}
            )
            
            if results['ids']:
                self.collection.delete(ids=results['ids'])
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {str(e)}")
            return False
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the vector store.
        
        Returns:
            Dictionary containing collection statistics
        """
        stats = {
            "collection_name": self.collection_name,
            "embedding_model": self.embedding_model,
            "count": self.collection.count(),
            "dimensions": len(self.embedding_function(["test"])[0]) if self.collection.count() > 0 else 0
        }
        
        return stats

# Example usage
if __name__ == "__main__":
    # Initialize vector store
    vector_store = VectorStore()
    
    # Example of adding documents
    from rag.document_processor import DocumentChunk
    
    test_chunks = [
        DocumentChunk(
            content="This is a test document about financial planning.",
            metadata={"source": "test.txt", "topic": "financial_planning"},
            chunk_id="test_1",
            document_id="doc1"
        ),
        DocumentChunk(
            content="This is another test document about investment strategies.",
            metadata={"source": "test.txt", "topic": "investments"},
            chunk_id="test_2",
            document_id="doc1"
        )
    ]
    
    # Add to vector store
    vector_store.add_documents(test_chunks)
    
    # Perform similarity search
    results = vector_store.similarity_search("What are some investment strategies?")
    for chunk, score in results:
        print(f"Score: {score:.3f} - {chunk.content[:100]}...")
    
    # Get collection stats
    stats = vector_store.get_collection_stats()
    print(f"\nCollection stats: {stats}")
