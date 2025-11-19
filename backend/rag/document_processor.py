import os
import re
from typing import List, Dict, Any, Optional
from pathlib import Path
import logging
from dataclasses import dataclass
from enum import Enum
import PyPDF2
import docx2txt
from bs4 import BeautifulSoup
import pandas as pd

logger = logging.getLogger(__name__)

class DocumentType(Enum):
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    CSV = "csv"
    HTML = "html"
    JSON = "json"
    
@dataclass
class DocumentChunk:
    content: str
    metadata: Dict[str, Any]
    chunk_id: str
    document_id: str
    page_number: Optional[int] = None
    section: Optional[str] = None
    
class DocumentProcessor:
    """
    Handles loading and processing of different document types into chunks
    suitable for vector storage and retrieval.
    """
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def load_document(self, file_path: str) -> str:
        """Load document content based on file extension."""
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"Document not found: {file_path}")
            
        ext = file_path.suffix.lower()[1:]
        
        try:
            if ext == 'pdf':
                return self._load_pdf(file_path)
            elif ext == 'docx':
                return self._load_docx(file_path)
            elif ext in ['txt', 'md']:
                return self._load_text(file_path)
            elif ext == 'csv':
                return self._load_csv(file_path)
            elif ext == 'html':
                return self._load_html(file_path)
            elif ext == 'json':
                return self._load_json(file_path)
            else:
                raise ValueError(f"Unsupported file type: {ext}")
        except Exception as e:
            logger.error(f"Error loading document {file_path}: {str(e)}")
            raise
    
    def chunk_document(self, 
                      content: str, 
                      metadata: Dict[str, Any],
                      document_id: str) -> List[DocumentChunk]:
        """Split document into overlapping chunks with metadata."""
        # Simple chunking by character count with overlap
        chunks = []
        start = 0
        chunk_id = 0
        
        while start < len(content):
            end = min(start + self.chunk_size, len(content))
            chunk_content = content[start:end].strip()
            
            if chunk_content:  # Skip empty chunks
                chunk_metadata = metadata.copy()
                chunk_metadata['chunk_id'] = f"{document_id}_chunk_{chunk_id}"
                
                chunk = DocumentChunk(
                    content=chunk_content,
                    metadata=chunk_metadata,
                    chunk_id=chunk_metadata['chunk_id'],
                    document_id=document_id
                )
                chunks.append(chunk)
                
            start = end - self.chunk_overlap
            chunk_id += 1
            
        return chunks
    
    def _load_pdf(self, file_path: Path) -> str:
        """Extract text from PDF file."""
        text = []
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text.append(page.extract_text())
        return '\n'.join(text)
    
    def _load_docx(self, file_path: Path) -> str:
        """Extract text from DOCX file."""
        return docx2txt.process(str(file_path))
    
    def _load_text(self, file_path: Path) -> str:
        """Load text from plain text file."""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    def _load_csv(self, file_path: Path) -> str:
        """Convert CSV to formatted text."""
        df = pd.read_csv(file_path)
        return df.to_string(index=False)
    
    def _load_html(self, file_path: Path) -> str:
        """Extract text from HTML file."""
        with open(file_path, 'r', encoding='utf-8') as file:
            soup = BeautifulSoup(file, 'html.parser')
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.extract()
            return soup.get_text(separator='\n')
    
    def _load_json(self, file_path: Path) -> str:
        """Convert JSON to formatted text."""
        import json
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return json.dumps(data, indent=2)

# Example usage:
if __name__ == "__main__":
    processor = DocumentProcessor()
    content = processor.load_document("example.pdf")
    chunks = processor.chunk_document(
        content,
        {"source": "example.pdf", "date": "2023-01-01"},
        "doc123"
    )
    print(f"Created {len(chunks)} chunks")
