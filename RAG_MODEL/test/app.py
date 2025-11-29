import os
import google.generativeai as genai
import chromadb
import textwrap
from pathlib import Path
from dotenv import load_dotenv

# --- Configuration ---
# Paths relative to the test folder
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

DB_PATH = str(Path(__file__).parent.parent / "vector_db")
FITNESS_COLLECTION = "fitness_knowledge"
NUTRITION_COLLECTION = "nutrition_knowledge"
GENERATION_MODEL = "models/gemini-2.5-flash"  # Updated to use available model
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

def initialize_models():
    """
    Initialize and configure Gemini models and ChromaDB client.
    Loads both fitness and nutrition collections.
    """
    # 1. Setup Gemini API Key
    # 1. Setup Gemini API Key
    try:
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not set. Please update your .env file.")
        genai.configure(api_key=GEMINI_API_KEY)
        print("✅ Gemini API key configured.")
    except Exception as e:
        print(f"❌ FATAL: Failed to configure Gemini API key: {e}")
        return None, None, None
    
    # 2. Setup ChromaDB - Load both collections
    try:
        client = chromadb.PersistentClient(path=DB_PATH)
        
        # Load fitness collection
        fitness_collection = client.get_collection(name=FITNESS_COLLECTION)
        print(f"✅ Fitness collection loaded: {fitness_collection.count()} exercises")
        
        # Load nutrition collection
        nutrition_collection = client.get_collection(name=NUTRITION_COLLECTION)
        print(f"✅ Nutrition collection loaded: {nutrition_collection.count()} food items")
        
    except Exception as e:
        print(f"❌ FATAL: Could not load ChromaDB collections.")
        print(f"Error: {e}")
        print(f"Please make sure '{DB_PATH}' exists and both ingestions were successful.")
        return None, None, None

    # 3. Initialize Generative Model for chat
    # Try different model names in order of preference
    model_names = [
        "models/gemini-2.5-flash",
        "models/gemini-flash-latest",
        "models/gemini-2.0-flash",
        "models/gemini-pro-latest"
    ]
    
    generation_model = None
    for model_name in model_names:
        try:
            generation_model = genai.GenerativeModel(model_name)
            # Test the model with a simple generation
            test_response = generation_model.generate_content("Hello")
            print(f"✅ Using Gemini model: {model_name}")
            break
        except Exception as e:
            print(f"⚠️  Model '{model_name}' not available: {str(e)[:60]}...")
            continue
    
    if not generation_model:
        print("❌ FATAL: No compatible Gemini model found.")
        return None, None, None
    
    return fitness_collection, nutrition_collection, generation_model

def get_rag_response(query, fitness_collection, nutrition_collection, generation_model, k=5):
    """
    Performs the full RAG pipeline: Retrieve, Augment, Generate.
    Searches both fitness and nutrition collections and combines results.
    """
    
    # 1. RETRIEVE: Query both ChromaDB collections for k nearest neighbors
    print(f"\n🔍 Searching in both fitness and nutrition databases...")
    
    # Search fitness collection
    fitness_results = fitness_collection.query(
        query_texts=[query],
        n_results=k
    )
    
    # Search nutrition collection
    nutrition_results = nutrition_collection.query(
        query_texts=[query],
        n_results=k
    )
    
    # Combine results
    all_docs = []
    all_metadata = []
    
    # Add fitness results
    if fitness_results["documents"][0]:
        all_docs.extend(fitness_results["documents"][0])
        all_metadata.extend([{**meta, "source": "fitness"} for meta in fitness_results["metadatas"][0]])
    
    # Add nutrition results
    if nutrition_results["documents"][0]:
        all_docs.extend(nutrition_results["documents"][0])
        all_metadata.extend([{**meta, "source": "nutrition"} for meta in nutrition_results["metadatas"][0]])
    
    # Prepare context for the prompt
    context = "\n---\n".join(all_docs)
    
    # Print what was retrieved (good for debugging)
    print("\n--- 📚 Retrieved Context ---")
    for i, meta in enumerate(all_metadata):
        if meta.get("source") == "fitness":
            print(f"  {i+1}. [EXERCISE] {meta.get('title', 'N/A')} ({meta.get('level', 'N/A')})")
            print(f"     Body Part: {meta.get('body_part', 'N/A')}, Equipment: {meta.get('equipment', 'N/A')}")
        else:
            print(f"  {i+1}. [FOOD] {meta.get('name', 'N/A')}")
            print(f"     Calories: {meta.get('calories', 'N/A')} kcal, Protein: {meta.get('protein', 'N/A')}")
    print("-" * 50)

    # 2. AUGMENT: Create the prompt
    prompt = f"""
You are an expert AI Fitness Coach named FitGenie.
Your task is to answer the user's question based *only* on the verified information provided below.

You have access to TWO types of data:
1. Exercise Database - workout exercises with details
2. Nutrition Database - food items with nutritional information

Provide answers based on the most relevant information from these databases.

**User's Question:**
{query}

**Verified Information from Databases:**
{context}

**Your Answer (be concise, helpful, and encouraging):**
"""
    
    # 3. GENERATE: Get the final answer from the LLM
    print("💬 Generating answer...")
    try:
        response = generation_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error during generation: {e}")
        return "I'm sorry, I encountered an error while generating a response."

def main():
    """
    Main chat loop for the terminal.
    """
    print("\n" + "=" * 60)
    print("🤖 FitGenie AI Fitness & Nutrition Coach (Terminal Test)")
    print("=" * 60)
    
    fitness_collection, nutrition_collection, generation_model = initialize_models()
    
    if not fitness_collection or not nutrition_collection:
        return  # Exit if setup failed

    print("\n💪 Ask me about exercises and nutrition!")
    print("   I can help with workouts AND food choices!")
    print("   (Type 'q' or 'quit' to exit)")
    print("-" * 60)

    while True:
        try:
            user_query = input("\n👤 You: ")
            
            if user_query.lower() in ['q', 'quit', 'exit']:
                print("\n👋 Goodbye! Keep crushing those fitness goals!")
                break
            
            if not user_query.strip():
                continue
                
            # Get the RAG response from both collections
            answer = get_rag_response(user_query, fitness_collection, nutrition_collection, generation_model)
            
            # Print the formatted answer
            print(f"\n🤖 FitGenie:")
            print(textwrap.fill(answer, width=80, initial_indent="   ", subsequent_indent="   "))
            
        except (KeyboardInterrupt, EOFError):
            print("\n\n👋 Goodbye! Keep crushing those fitness goals!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            continue

if __name__ == "__main__":
    main()
