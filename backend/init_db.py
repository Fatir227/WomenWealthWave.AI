import os
from rag.vector_store import VectorStore
from config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_database():
    """Initialize the database and create necessary collections."""
    try:
        logger.info("Initializing database...")
        
        # This will automatically create the collection if it doesn't exist
        vector_store = VectorStore()
        
        # Verify the collection exists
        stats = vector_store.get_collection_stats()
        logger.info(f"Database initialized successfully. Collection stats: {stats}")
        return True
        
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        return False

if __name__ == "__main__":
    initialize_database()
