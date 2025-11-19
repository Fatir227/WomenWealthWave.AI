from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl
from enum import Enum
import os
import tempfile
from pathlib import Path

from api.v1.services.agent_service import agent_service
from ingestion.ingestion_service import ingestion_service
from config import settings

router = APIRouter()

# Enums for request validation
class AgeGroup(str, Enum):
    TEEN = "15-20"
    YOUNG_ADULT = "21-28"
    ADULT = "29-35"

class Region(str, Enum):
    INDIA = "india"
    INTERNATIONAL = "international"

# Request/Response Models
class DocumentReference(BaseModel):
    title: str = Field(..., description="Title of the document")
    source: str = Field(..., description="Source of the document")
    page: Optional[int] = Field(None, description="Page number if applicable")
    url: Optional[HttpUrl] = Field(None, description="URL to the source document if available")
    score: Optional[float] = Field(None, description="Relevance score of the document")

class QueryRequest(BaseModel):
    question: str = Field(..., description="The user's question about financial literacy", min_length=5, max_length=1000)
    age_group: AgeGroup = Field(..., description="User's age group (15-20, 21-28, 29-35)")
    region: Region = Field(..., description="User's region (india or international)")
    language: str = Field("en", description="Preferred language for the response", min_length=2, max_length=10)

class QueryResponse(BaseModel):
    answer: str = Field(..., description="Direct answer to the question")
    explanation: str = Field(..., description="Detailed explanation")
    example: Optional[str] = Field(None, description="Practical example relevant to the user's context")
    action_steps: List[str] = Field(..., description="Actionable steps the user can take")
    source_documents: List[DocumentReference] = Field(..., description="Sources used to generate the answer")

class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="Overall service status")
    version: str = Field(..., description="API version")
    services: Dict[str, Any] = Field(..., description="Status of individual services")

class IngestResponse(BaseModel):
    status: str = Field(..., description="Ingestion status")
    document_id: Optional[str] = Field(None, description="ID of the ingested document")
    chunks_ingested: Optional[int] = Field(None, description="Number of chunks ingested")
    message: Optional[str] = Field(None, description="Additional message or error details")
    vector_db_stats: Optional[Dict[str, Any]] = Field(None, description="Vector database statistics")

# API Endpoints
@router.post(
    "/ask",
    response_model=QueryResponse,
    summary="Ask a financial literacy question",
    description="Get a personalized response to financial literacy questions based on age group and region.",
    response_description="Structured response with financial advice"
)
async def ask_question(query: QueryRequest):
    """
    Main endpoint for asking financial literacy questions.
    The response is tailored based on the user's age group and region.
    """
    try:
        # Process the query using the agent service
        response = await agent_service.process_query(
            question=query.question,
            age_group=query.age_group.value,
            region=query.region.value,
            language=query.language
        )
        
        # Convert source documents to the response model
        source_docs = []
        for doc in response.get('sources', []):
            source_docs.append(DocumentReference(
                title=doc.get('metadata', {}).get('source', 'Unknown Source'),
                source=doc.get('metadata', {}).get('source', 'Unknown'),
                page=doc.get('metadata', {}).get('page'),
                score=doc.get('score')
            ))
        
        return QueryResponse(
            answer=response.get('answer', 'No answer could be generated.'),
            explanation=response.get('explanation', ''),
            example=response.get('example', ''),
            action_steps=response.get('action_steps', []),
            source_documents=source_docs
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        )

@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health check",
    description="Check the health status of the API and its dependencies.",
    response_description="Service health status"
)
async def health_check():
    """Health check endpoint"""
    try:
        # Check agent service health
        agent_health = await agent_service.health_check()
        
        # Get ingestion service stats
        ingestion_stats = await ingestion_service.get_document_stats()
        
        return {
            "status": agent_health.get("status", "unknown"),
            "version": "1.0.0",
            "services": {
                "agent": agent_health,
                "vector_db": ingestion_stats.get("stats", {}) if ingestion_stats["status"] == "success" else {"status": "error"},
                "api": {"status": "running"}
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "version": "1.0.0",
            "services": {
                "agent": {"status": "error", "error": str(e)},
                "vector_db": {"status": "unknown"},
                "api": {"status": "running"}
            }
        }

@router.post(
    "/ingest",
    response_model=IngestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest a document",
    description="Upload and process a document to add to the knowledge base.",
    response_description="Status of the ingestion process"
)
async def ingest_document(
    file: UploadFile = File(..., description="The document file to ingest"),
    document_type: str = Form(..., description="Type of the document (pdf, txt, csv, etc.)"),
    metadata: str = Form('{}', description="Additional metadata as a JSON string")
):
    """
    Ingest a new document into the knowledge base.
    This will process the document, chunk it, and add it to the vector store.
    """
    try:
        # Create a temporary file to save the uploaded content
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{document_type}") as temp_file:
            # Save uploaded file to temp location
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Parse metadata
            import json
            metadata_dict = json.loads(metadata) if metadata else {}
            
            # Process the document
            result = await ingestion_service.ingest_document(
                file_path=temp_file_path,
                document_type=document_type,
                metadata=metadata_dict
            )
            
            return result
            
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                logger.warning(f"Failed to delete temporary file {temp_file_path}: {str(e)}")
                
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid metadata format. Must be a valid JSON string."
        )
    except Exception as e:
        logger.error(f"Error ingesting document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}"
        )

# Additional endpoints for document management
@router.delete(
    "/documents/{document_id}",
    response_model=dict,
    summary="Delete a document",
    description="Remove a document and all its chunks from the knowledge base."
)
async def delete_document(document_id: str):
    """Delete a document from the knowledge base."""
    try:
        result = await ingestion_service.delete_document(document_id)
        if result["status"] == "not_found":
            raise HTTPException(status_code=404, detail=result["message"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting document {document_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {str(e)}"
        )

@router.get(
    "/documents/stats",
    response_model=Dict[str, Any],
    tags=["documents"]
)
async def get_document_stats():
    """Get statistics about the documents in the knowledge base."""
    try:
        stats = {
            "total_documents": 0,  # This would come from your actual database
            "total_chunks": 0,     # This would come from your actual database
            "vector_db_status": "ok"
        }
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving document stats: {str(e)}"
        )

# Export the router for use in main.py
api_router = router
