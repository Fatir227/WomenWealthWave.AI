import sys
import os
# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.vector_store import VectorStore

print("Testing ChromaDB initialization...")
try:
    # This will create the collection if it doesn't exist
    print("Creating VectorStore instance...")
    vector_store = VectorStore()
    print("✓ Successfully initialized ChromaDB!")
    
    # Test adding a sample document
    from rag.document_processor import DocumentChunk
    print("\nTesting document addition...")
    test_chunk = DocumentChunk(
        content="This is a test document about financial literacy.",
        metadata={"source": "test", "type": "test"},
        chunk_id="test_1",
        document_id="test_doc_1"
    )
    
    ids = vector_store.add_documents([test_chunk])
    print(f"✓ Added test document with IDs: {ids}")
    
    # Test searching
    print("\nTesting search...")
    results = vector_store.similarity_search("financial literacy", k=1)
    print(f"✓ Found {len(results)} results")
    
    # Print collection stats
    stats = vector_store.get_collection_stats()
    print("\nCollection stats:")
    for k, v in stats.items():
        print(f"- {k}: {v}")
        
except Exception as e:
    print(f"\n❌ Error during testing: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
