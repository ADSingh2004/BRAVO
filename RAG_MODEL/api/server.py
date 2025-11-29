"""
BRAVO RAG API Server
Flask-based API server that exposes the RAG model for the frontend.
"""

import os
import sys
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import chromadb
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load .env file from project root
ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / ".env")

# --- Configuration ---
DB_PATH = str(Path(__file__).parent.parent / "vector_db")
FITNESS_COLLECTION = "fitness_knowledge"
NUTRITION_COLLECTION = "nutrition_knowledge"

# Get API key from environment variable (loaded from .env)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

# Global variables for models (initialized once)
fitness_collection = None
nutrition_collection = None
generation_model = None
is_initialized = False


def initialize_models():
    """
    Initialize and configure Gemini models and ChromaDB client.
    """
    global fitness_collection, nutrition_collection, generation_model, is_initialized
    
    if is_initialized:
        return True
    
    try:
        # 1. Setup Gemini API Key
        if not GEMINI_API_KEY:
            print("⚠️  GEMINI_API_KEY not set. Set it using:")
            print("   $env:GEMINI_API_KEY = 'your-api-key'")
            print("   The server will run but AI responses will use fallback mode.")
        else:
            genai.configure(api_key=GEMINI_API_KEY)
            print("✅ Gemini API key configured.")
        
        # 2. Setup ChromaDB - Load both collections
        client = chromadb.PersistentClient(path=DB_PATH)
        
        fitness_collection = client.get_collection(name=FITNESS_COLLECTION)
        print(f"✅ Fitness collection loaded: {fitness_collection.count()} exercises")
        
        nutrition_collection = client.get_collection(name=NUTRITION_COLLECTION)
        print(f"✅ Nutrition collection loaded: {nutrition_collection.count()} food items")
        
        # 3. Initialize Generative Model
        model_names = [
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash-latest",
            "gemini-1.5-flash",
            "gemini-1.5-pro-latest",
            "gemini-pro",
            "models/gemini-2.5-flash",
            "models/gemini-flash-latest",
            "models/gemini-2.0-flash",
            "models/gemini-pro-latest",
        ]
        
        for model_name in model_names:
            try:
                generation_model = genai.GenerativeModel(model_name)
                test_response = generation_model.generate_content("Hello")
                print(f"✅ Using Gemini model: {model_name}")
                break
            except Exception as e:
                print(f"⚠️  Model '{model_name}' not available: {str(e)[:60]}...")
                continue
        
        if not generation_model:
            print("❌ No compatible Gemini model found.")
            print("   Please set a valid GEMINI_API_KEY environment variable.")
            return False
        
        is_initialized = True
        return True
        
    except Exception as e:
        print(f"❌ Initialization error: {e}")
        return False


def get_rag_response(query: str, user_context: dict = None, k: int = 5) -> dict:
    """
    Performs the full RAG pipeline: Retrieve, Augment, Generate.
    Returns structured response with metadata.
    """
    
    if not is_initialized:
        if not initialize_models():
            return {
                "success": False,
                "error": "Models not initialized",
                "response": "I'm sorry, the AI system is not ready. Please try again later."
            }
    
    try:
        # 1. RETRIEVE: Query both ChromaDB collections
        fitness_results = fitness_collection.query(
            query_texts=[query],
            n_results=k
        )
        
        nutrition_results = nutrition_collection.query(
            query_texts=[query],
            n_results=k
        )
        
        # Combine results
        all_docs = []
        all_metadata = []
        sources = []
        
        # Add fitness results
        if fitness_results["documents"][0]:
            all_docs.extend(fitness_results["documents"][0])
            for meta in fitness_results["metadatas"][0]:
                all_metadata.append({**meta, "source": "fitness"})
                sources.append({
                    "type": "exercise",
                    "name": meta.get('title', 'Unknown'),
                    "details": f"Level: {meta.get('level', 'N/A')}, Body Part: {meta.get('body_part', 'N/A')}"
                })
        
        # Add nutrition results
        if nutrition_results["documents"][0]:
            all_docs.extend(nutrition_results["documents"][0])
            for meta in nutrition_results["metadatas"][0]:
                all_metadata.append({**meta, "source": "nutrition"})
                sources.append({
                    "type": "food",
                    "name": meta.get('name', 'Unknown'),
                    "details": f"Calories: {meta.get('calories', 'N/A')} kcal"
                })
        
        # Prepare context
        context = "\n---\n".join(all_docs)
        
        # Build user profile context if provided
        user_profile_text = ""
        if user_context:
            user_profile_text = f"""
**User Profile:**
- Fitness Goal: {user_context.get('goal', 'General fitness')}
- Experience Level: {user_context.get('fitnessLevel', 'Beginner')}
- Age: {user_context.get('age', 'Not specified')}
- Weight: {user_context.get('weight', 'Not specified')} kg
- Height: {user_context.get('height', 'Not specified')} cm
"""
        
        # 2. AUGMENT: Create the prompt
        prompt = f"""
You are BRAVO (Bio-Adaptive Recommendation Assistant for Vitality and Optimization), 
an expert AI Fitness Coach.

Your task is to answer the user's question based on the verified information provided below.
Be concise, helpful, encouraging, and personalize your response based on the user's profile if available.

You have access to TWO types of verified data:
1. Exercise Database - workout exercises with details
2. Nutrition Database - food items with nutritional information

{user_profile_text}

**User's Question:**
{query}

**Verified Information from BRAVO Database:**
{context}

**Your Answer (be concise, helpful, and encouraging):**
"""
        
        # 3. GENERATE: Get the final answer from the LLM
        response = generation_model.generate_content(prompt)
        
        return {
            "success": True,
            "response": response.text,
            "sources": sources[:5],  # Limit to 5 sources
            "verified": True
        }
        
    except Exception as e:
        print(f"❌ RAG Error: {e}")
        return {
            "success": False,
            "error": str(e),
            "response": "I'm sorry, I encountered an error while processing your question. Please try again."
        }


# --- API Routes ---

@app.route('/', methods=['GET'])
def index():
    """Root endpoint - API info."""
    return jsonify({
        "service": "BRAVO RAG API",
        "version": "1.0.0",
        "description": "Bio-Adaptive Recommendation Assistant for Vitality and Optimization",
        "endpoints": {
            "GET /": "This info page",
            "GET /api/health": "Health check",
            "POST /api/chat": "Send a message to the AI coach",
            "POST /api/initialize": "Re-initialize models"
        },
        "status": "online" if is_initialized else "initializing"
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "BRAVO RAG API",
        "initialized": is_initialized
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint for RAG responses.
    
    Expected JSON body:
    {
        "message": "user's question",
        "userContext": {
            "goal": "weight_loss",
            "fitnessLevel": "beginner",
            "age": 25,
            "weight": 70,
            "height": 175
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'message' in request body"
            }), 400
        
        message = data['message']
        user_context = data.get('userContext', {})
        
        # Get RAG response
        result = get_rag_response(message, user_context)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "response": "Server error occurred."
        }), 500


@app.route('/api/initialize', methods=['POST'])
def init_models():
    """Force re-initialization of models."""
    global is_initialized
    is_initialized = False
    
    success = initialize_models()
    
    return jsonify({
        "success": success,
        "message": "Models initialized" if success else "Initialization failed"
    })


# --- Main ---
if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🚀 BRAVO RAG API Server")
    print("=" * 60)
    
    # Initialize models on startup
    initialize_models()
    
    print("\n📡 Starting server on http://localhost:5000")
    print("   Frontend should connect to: http://localhost:5000/api/chat")
    print("-" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
