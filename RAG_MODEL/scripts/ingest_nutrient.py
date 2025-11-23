"""
Data Ingestion Script for FitGenie Nutrition RAG Model

This script processes the nutrition_data.json and builds the vector database
for the RAG pipeline using ChromaDB with SentenceTransformer embeddings.
"""

import json
import os
from pathlib import Path
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer


def load_processed_data():
    """Load processed nutrition data from nutrition_data.json."""
    data_path = Path(__file__).parent.parent / "dataset" / "processed" / "nutrition_data.json"
    print(f"📂 Loading data from: {data_path}")
    
    if not data_path.exists():
        raise FileNotFoundError(f"Data file not found at {data_path}")
    
    with open(data_path, 'r', encoding='utf-8') as f:
        nutrition_items = json.load(f)
    
    print(f"✅ Loaded {len(nutrition_items)} nutrition items")
    return nutrition_items


def prepare_documents(nutrition_items):
    """
    Prepare nutrition data for vector database ingestion.
    Creates document text, metadata, and IDs for each nutrition item.
    """
    print("🔧 Preparing documents for vectorization...")
    
    documents = []
    metadatas = []
    ids = []
    
    for idx, item in enumerate(nutrition_items):
        # Use the pre-created text_to_embed field
        doc_text = item.get('text_to_embed', '')
        
        documents.append(doc_text)
        
        # Store metadata for filtering and retrieval
        metadata = item.get('metadata', {})
        # Keep only essential metadata (avoid overly large metadata)
        metadatas.append({
            "name": str(metadata.get('name', 'unknown'))[:200],
            "serving_size": str(metadata.get('serving_size', ''))[:100],
            "calories": str(metadata.get('calories', '')),
            "protein": str(metadata.get('protein', '')),
            "total_fat": str(metadata.get('total_fat', '')),
            "carbohydrate": str(metadata.get('carbohydrate', '')),
            "fiber": str(metadata.get('fiber', '')),
            "sugars": str(metadata.get('sugars', '')),
            "source_file": str(metadata.get('source_file', ''))
        })
        
        # Use the existing doc_id or create one
        doc_id = item.get('doc_id', f"nutrition_{idx}")
        ids.append(doc_id)
    
    print(f"✅ Prepared {len(documents)} documents")
    return documents, metadatas, ids


def build_vector_database(documents, metadatas, ids):
    """Build and persist the vector database using ChromaDB."""
    print("🚀 Building vector database with ChromaDB...")
    
    # Define the path for the vector database (same as fitness)
    vector_db_path = Path(__file__).parent.parent / "vector_db"
    vector_db_path.mkdir(parents=True, exist_ok=True)
    
    print(f"📍 Vector database location: {vector_db_path}")
    
    # Initialize ChromaDB client with persistent storage
    client = chromadb.PersistentClient(path=str(vector_db_path))
    
    # Delete existing nutrition collection if it exists (for fresh start)
    try:
        client.delete_collection(name="nutrition_knowledge")
        print("🗑️  Deleted existing nutrition collection")
    except:
        pass
    
    # Create a new collection for nutrition
    collection = client.create_collection(
        name="nutrition_knowledge",
        metadata={"description": "Nutrition data from nutrition.csv"}
    )
    
    # Add documents to the collection in batches (ChromaDB has limits)
    batch_size = 100
    total_batches = (len(documents) + batch_size - 1) // batch_size
    
    print(f"📦 Adding documents in {total_batches} batches...")
    
    for i in range(0, len(documents), batch_size):
        batch_docs = documents[i:i + batch_size]
        batch_metas = metadatas[i:i + batch_size]
        batch_ids = ids[i:i + batch_size]
        
        collection.add(
            documents=batch_docs,
            metadatas=batch_metas,
            ids=batch_ids
        )
        
        batch_num = (i // batch_size) + 1
        print(f"  ✓ Batch {batch_num}/{total_batches} added ({len(batch_docs)} documents)")
    
    print(f"✅ Vector database built successfully!")
    print(f"   Total documents: {collection.count()}")
    print(f"   Location: {vector_db_path}")
    
    return collection


def test_vector_database(collection):
    """Test the vector database with a sample query."""
    print("\n🧪 Testing vector database with sample queries...")
    
    test_queries = [
        "high protein foods",
        "low calorie snacks",
        "foods with fiber"
    ]
    
    for query in test_queries:
        results = collection.query(
            query_texts=[query],
            n_results=3
        )
        
        print(f"\n📝 Query: '{query}'")
        print("   Top 3 results:")
        for i, (doc, meta) in enumerate(zip(results['documents'][0], results['metadatas'][0]), 1):
            print(f"   {i}. {meta['name']}")
            print(f"      Calories: {meta['calories']} kcal, Protein: {meta['protein']}")


def main():
    """Main execution function."""
    print("=" * 60)
    print("🍎 FitGenie Nutrition Data Ingestion Pipeline")
    print("=" * 60)
    
    try:
        # Step 1: Load processed data
        nutrition_items = load_processed_data()
        
        # Step 2: Prepare documents for vectorization
        documents, metadatas, ids = prepare_documents(nutrition_items)
        
        # Step 3: Build vector database
        collection = build_vector_database(documents, metadatas, ids)
        
        # Step 4: Test the database
        test_vector_database(collection)
        
        print("\n" + "=" * 60)
        print("✅ Nutrition data ingestion complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during ingestion: {e}")
        raise


if __name__ == "__main__":
    main()
