"""
Data Ingestion Script for WomenWealthWave.AI
Loads markdown files from knowledge_base and creates embeddings in ChromaDB
"""

import os
import sys
from pathlib import Path
from loguru import logger

# Add the app directory to Python path
sys.path.append(str(Path(__file__).parent))

from app.services.vector_store import vector_store

def load_markdown_files(directory: str):
    """Load all markdown files from the knowledge base directory."""
    knowledge_path = Path(directory)
    
    if not knowledge_path.exists():
        logger.error(f"Knowledge base directory not found: {directory}")
        return []
    
    documents = []
    md_files = list(knowledge_path.glob("*.md"))
    
    if not md_files:
        logger.warning(f"No markdown files found in {directory}")
        return []
    
    logger.info(f"Found {len(md_files)} markdown files")
    
    for md_file in md_files:
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Create document with metadata
                doc = {
                    "id": md_file.stem,  # filename without extension
                    "text": content,
                    "metadata": {
                        "source": md_file.name,
                        "category": "financial_literacy",
                        "type": "educational_content"
                    }
                }
                documents.append(doc)
                logger.info(f"Loaded: {md_file.name}")
                
        except Exception as e:
            logger.error(f"Error loading {md_file.name}: {str(e)}")
    
    return documents

def main():
    """Main ingestion function."""
    logger.info("=" * 60)
    logger.info("WomenWealthWave.AI - Data Ingestion")
    logger.info("=" * 60)
    
    # Path to knowledge base
    kb_path = Path(__file__).parent / "data" / "knowledge_base"
    
    logger.info(f"Loading documents from: {kb_path}")
    
    # Load markdown files
    documents = load_markdown_files(str(kb_path))
    
    if not documents:
        logger.error("No documents to ingest. Please add markdown files to data/knowledge_base/")
        return
    
    logger.info(f"Loaded {len(documents)} documents")
    
    # Add documents to vector store
    logger.info("Creating embeddings and storing in ChromaDB...")
    try:
        vector_store.add_documents(documents)
        logger.success(f"✅ Successfully ingested {len(documents)} documents!")
        logger.info("Vector database is ready for use.")
    except Exception as e:
        logger.error(f"Error during ingestion: {str(e)}")
        raise
    
    # Test retrieval
    logger.info("\nTesting retrieval...")
    test_query = "How to start investing?"
    results = vector_store.search(test_query, k=3)
    
    logger.info(f"Test query: '{test_query}'")
    logger.info(f"Found {len(results)} relevant documents:")
    for i, result in enumerate(results, 1):
        logger.info(f"  {i}. {result['metadata'].get('source', 'Unknown')} (score: {result['score']:.4f})")
    
    logger.info("\n" + "=" * 60)
    logger.success("✅ Data ingestion completed successfully!")
    logger.info("=" * 60)
    logger.info("\nNext steps:")
    logger.info("1. Start the backend: uvicorn app.main:app --reload")
    logger.info("2. Start the frontend: npm run dev")
    logger.info("3. Open http://localhost:5173 in your browser")

if __name__ == "__main__":
    main()
