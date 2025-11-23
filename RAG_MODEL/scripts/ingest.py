"""
Data Ingestion Script for FitGenie RAG Model

This script processes the processed_data.json and builds the vector database
for the RAG pipeline using ChromaDB with SentenceTransformer embeddings.
"""

import os
import json
from pathlib import Path
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer


def load_processed_data():
    """Load processed fitness exercise data from processed_data.json."""
    data_path = Path(__file__).parent.parent / "dataset" / "processed" / "processed_data.json"
    print(f"📂 Loading data from: {data_path}")
    
    if not data_path.exists():
        raise FileNotFoundError(f"Data file not found at {data_path}")
    
    with open(data_path, 'r', encoding='utf-8') as f:
        exercises = json.load(f)
    
    print(f"✅ Loaded {len(exercises)} exercises")
    return exercises


def prepare_documents(exercises):
    """
    Prepare exercise data for vector database ingestion.
    Creates document text, metadata, and IDs for each exercise.
    """
    print("🔧 Preparing documents for vectorization...")
    
    documents = []
    metadatas = []
    ids = []
    
    for idx, exercise in enumerate(exercises):
        # Use the pre-created text_to_embed field
        doc_text = exercise.get('text_to_embed', '')
        
        documents.append(doc_text)
        
        # Store metadata for filtering and retrieval
        metadata = exercise.get('metadata', {})
        metadatas.append({
            "title": metadata.get('title', 'unknown'),
            "type": metadata.get('type', 'unknown'),
            "body_part": metadata.get('body_part', 'unknown'),
            "equipment": metadata.get('equipment', 'unknown'),
            "level": metadata.get('level', 'unknown'),
            "rating": str(metadata.get('rating', '')),
            "source": metadata.get('source', '')
        })
        
        # Use the existing doc_id or create one
        doc_id = exercise.get('doc_id', f"exercise_{idx}")
        ids.append(doc_id)
    
    print(f"✅ Prepared {len(documents)} documents")
    return documents, metadatas, ids


def build_vector_database(documents, metadatas, ids):
    """Build and persist the vector database using ChromaDB."""
    print("🚀 Building vector database with ChromaDB...")
    
    # Define the path for the vector database
    vector_db_path = Path(__file__).parent.parent / "vector_db"
    vector_db_path.mkdir(parents=True, exist_ok=True)
    
    print(f"📍 Vector database location: {vector_db_path}")
    
    # Initialize ChromaDB client with persistent storage
    client = chromadb.PersistentClient(path=str(vector_db_path))
    
    # Delete existing collection if it exists (for fresh start)
    try:
        client.delete_collection(name="fitness_knowledge")
        print("🗑️  Deleted existing collection")
    except:
        pass
    
    # Create a new collection
    collection = client.create_collection(
        name="fitness_knowledge",
        metadata={"description": "Fitness exercises from megaGymDataset"}
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
        "exercises for chest",
        "beginner leg workout",
        "exercises with dumbbells"
    ]
    
    for query in test_queries:
        results = collection.query(
            query_texts=[query],
            n_results=3
        )
        
        print(f"\n📝 Query: '{query}'")
        print("   Top 3 results:")
        for i, (doc, meta) in enumerate(zip(results['documents'][0], results['metadatas'][0]), 1):
            print(f"   {i}. {meta['title']} ({meta['level']})")
            print(f"      Body Part: {meta['body_part']}, Equipment: {meta['equipment']}")


def main():
    """Main execution function."""
    print("=" * 60)
    print("💪 FitGenie Data Ingestion Pipeline")
    print("=" * 60)
    
    try:
        # Step 1: Load processed data
        exercises = load_processed_data()
        
        # Step 2: Prepare documents for vectorization
        documents, metadatas, ids = prepare_documents(exercises)
        
        # Step 3: Build vector database
        collection = build_vector_database(documents, metadatas, ids)
        
        # Step 4: Test the database
        test_vector_database(collection)
        
        print("\n" + "=" * 60)
        print("✅ Data ingestion complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during ingestion: {e}")
        raise


if __name__ == "__main__":
    main()
