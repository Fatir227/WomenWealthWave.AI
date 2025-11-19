import os
from typing import List, Dict, Any, Optional
import chromadb
from sentence_transformers import SentenceTransformer
import numpy as np
from loguru import logger
import json

from app.core.config import settings

class VectorStore:
    def __init__(self):
        """Initialize the vector store with ChromaDB and sentence transformer."""
        # Create persist directory if it doesn't exist
        os.makedirs(settings.CHROMA_DB_PATH, exist_ok=True)
        
        # Use the new PersistentClient API
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_PATH
        )
        
        # Initialize the embedding model
        self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.collection_name = "financial_literacy"
        self.collection = self._get_or_create_collection()
    
    def _get_or_create_collection(self):
        """Get or create the collection in ChromaDB."""
        try:
            collection = self.client.get_collection(name=self.collection_name)
            logger.info(f"Loaded existing collection: {self.collection_name}")
        except Exception as e:
            # Collection doesn't exist, create it
            collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            logger.info(f"Created new collection: {self.collection_name}")
        return collection
    
    def add_documents(self, documents: List[Dict[str, Any]]):
        """Add documents to the vector store.
        
        Args:
            documents: List of dictionaries containing 'text', 'metadata', and 'id'.
        """
        if not documents:
            return
            
        texts = [doc["text"] for doc in documents]
        embeddings = self.embedding_model.encode(texts, show_progress_bar=True)
        
        # Convert to list of lists for ChromaDB
        embeddings = [embedding.tolist() for embedding in embeddings]
        
        # Prepare data for ChromaDB
        ids = [doc["id"] for doc in documents]
        metadatas = [doc.get("metadata", {}) for doc in documents]
        
        self.collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
        
        # Data is automatically persisted with PersistentClient
        logger.info(f"Added {len(documents)} documents to the vector store.")
    
    def search(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """Search for similar documents in the vector store.
        
        Args:
            query: The search query.
            k: Number of results to return.
            
        Returns:
            List of dictionaries containing the document text, metadata, and similarity score.
        """
        # Generate query embedding
        query_embedding = self.embedding_model.encode(query, show_progress_bar=False)
        
        # Search in ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=min(k, 10)  # Limit to 10 results max
        )
        
        # Process and return results
        documents = []
        for i in range(len(results["documents"][0])):
            doc_text = results["documents"][0][i]
            doc_metadata = results["metadatas"][0][i] if results["metadatas"] else {}
            doc_score = results["distances"][0][i] if results["distances"] else 0.0
            
            documents.append({
                "text": doc_text,
                "metadata": doc_metadata,
                "score": float(doc_score)
            })
        
        return documents
    
    def load_from_directory(self, directory: str, file_extension: str = ".json"):
        """Load documents from a directory of JSON files.
        
        Args:
            directory: Path to the directory containing JSON files.
            file_extension: File extension to filter files.
        """
        if not os.path.exists(directory):
            logger.warning(f"Directory not found: {directory}")
            return
            
        documents = []
        for filename in os.listdir(directory):
            if not filename.endswith(file_extension):
                continue
                
            file_path = os.path.join(directory, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        documents.extend(data)
                    else:
                        documents.append(data)
            except Exception as e:
                logger.error(f"Error loading {file_path}: {str(e)}")
        
        if documents:
            self.add_documents(documents)
            logger.info(f"Loaded {len(documents)} documents from {directory}")
        else:
            logger.warning(f"No documents found in {directory}")

# Global instance
vector_store = VectorStore()
