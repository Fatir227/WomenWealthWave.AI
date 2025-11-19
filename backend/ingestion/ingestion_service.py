import os
import logging
import uuid
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

from rag.document_processor import DocumentProcessor, DocumentChunk
from rag.vector_store import VectorStore
from config import settings

logger = logging.getLogger(__name__)

class IngestionService:
    """
    Service for ingesting and processing financial literacy documents.
    Handles document loading, chunking, and storage in the vector database.
    """
    
    def __init__(self, vector_store: Optional[VectorStore] = None):
        self.vector_store = vector_store or VectorStore()
        self.document_processor = DocumentProcessor()
        
    async def ingest_document(
        self,
        file_path: str,
        document_type: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Ingest a document into the knowledge base.
        
        Args:
            file_path: Path to the document file
            document_type: Type of document (pdf, txt, csv, etc.)
            metadata: Additional metadata about the document
            
        Returns:
            Dictionary with ingestion status and document ID
        """
        try:
            # Validate file exists
            file_path = Path(file_path)
            if not file_path.exists():
                raise FileNotFoundError(f"File not found: {file_path}")
            
            # Generate document ID
            doc_id = f"doc_{uuid.uuid4().hex[:12]}"
            
            # Prepare metadata
            if metadata is None:
                metadata = {}
                
            # Add/update metadata
            metadata.update({
                "document_id": doc_id,
                "source": str(file_path.name),
                "ingestion_date": datetime.utcnow().isoformat(),
                "document_type": document_type,
                "file_size": os.path.getsize(file_path),
                **metadata  # Allow overriding default metadata
            })
            
            # Load and process the document
            content = self.document_processor.load_document(str(file_path))
            chunks = self.document_processor.chunk_document(
                content=content,
                metadata=metadata,
                document_id=doc_id
            )
            
            # Store chunks in vector database
            if chunks:
                self.vector_store.add_documents(chunks)
                
                # Get collection stats
                stats = self.vector_store.get_collection_stats()
                
                return {
                    "status": "success",
                    "document_id": doc_id,
                    "chunks_ingested": len(chunks),
                    "vector_db_stats": stats
                }
            else:
                return {
                    "status": "error",
                    "message": "No valid chunks were extracted from the document"
                }
                
        except Exception as e:
            logger.error(f"Error ingesting document {file_path}: {str(e)}", exc_info=True)
            return {
                "status": "error",
                "message": f"Failed to ingest document: {str(e)}"
            }
    
    async def delete_document(self, document_id: str) -> Dict[str, Any]:
        """
        Delete a document and all its chunks from the vector store.
        
        Args:
            document_id: ID of the document to delete
            
        Returns:
            Dictionary with deletion status
        """
        try:
            success = self.vector_store.delete_document(document_id)
            if success:
                return {
                    "status": "success",
                    "message": f"Document {document_id} deleted successfully"
                }
            else:
                return {
                    "status": "not_found",
                    "message": f"Document {document_id} not found"
                }
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {str(e)}")
            return {
                "status": "error",
                "message": f"Failed to delete document: {str(e)}"
            }
    
    async def get_document_stats(self) -> Dict[str, Any]:
        """
        Get statistics about documents in the vector store.
        
        Returns:
            Dictionary with document statistics
        """
        try:
            stats = self.vector_store.get_collection_stats()
            return {
                "status": "success",
                "stats": stats
            }
        except Exception as e:
            logger.error(f"Error getting document stats: {str(e)}")
            return {
                "status": "error",
                "message": f"Failed to get document stats: {str(e)}"
            }

# Singleton instance
ingestion_service = IngestionService()
