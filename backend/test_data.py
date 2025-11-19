from app.services.vector_store import vector_store

# Test if data is loaded
print("Testing vector database...")
print("=" * 60)

# Search for government schemes
results = vector_store.search('government schemes for women', k=5)
print(f"\n✅ Found {len(results)} documents for 'government schemes'\n")

for i, result in enumerate(results, 1):
    source = result.get('metadata', {}).get('source', 'Unknown')
    score = result.get('score', 0)
    text_preview = result.get('text', '')[:150]
    print(f"{i}. Source: {source}")
    print(f"   Score: {score:.4f}")
    print(f"   Preview: {text_preview}...")
    print()

# Check collection stats
try:
    collection = vector_store.collection
    count = collection.count()
    print(f"📊 Total documents in database: {count}")
except Exception as e:
    print(f"❌ Error checking collection: {e}")
