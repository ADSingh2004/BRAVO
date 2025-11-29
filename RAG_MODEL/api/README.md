# BRAVO RAG API Server

This is the backend API server that powers the BRAVO AI Coach chatbot using RAG (Retrieval-Augmented Generation).

## Architecture

```
Frontend (React) <---> Orchestrator Service <---> RAG API Server <---> ChromaDB + Gemini
                                                        |
                                                        v
                                              Vector Database (exercises, nutrition)
```

## Quick Start

### 1. Install Dependencies

```bash
cd RAG_MODEL/api
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python server.py
```

The server will start on `http://localhost:5000`

### 3. Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Send a chat message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What exercises are good for building chest muscles?"}'
```

## API Endpoints

### GET /api/health
Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "BRAVO RAG API",
  "initialized": true
}
```

### POST /api/chat
Main chat endpoint for RAG-powered responses.

**Request Body:**
```json
{
  "message": "What are good protein sources?",
  "userContext": {
    "goal": "muscle_building",
    "fitnessLevel": "intermediate",
    "age": 25,
    "weight": 70,
    "height": 175
  }
}
```

**Response:**
```json
{
  "success": true,
  "response": "Great question! For muscle building, here are excellent protein sources...",
  "sources": [
    {
      "type": "food",
      "name": "Chicken Breast",
      "details": "Calories: 165 kcal"
    }
  ],
  "verified": true
}
```

### POST /api/initialize
Force re-initialization of models (useful for troubleshooting).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Built-in key |
| `VITE_RAG_API_URL` | Frontend API URL | `http://localhost:5000` |

## Troubleshooting

### API not responding
1. Make sure ChromaDB vector database exists in `RAG_MODEL/vector_db/`
2. Check if all dependencies are installed
3. Verify the Gemini API key is valid

### CORS errors
The server is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`

### Model initialization failed
Try a different Gemini model by modifying the `model_names` list in `server.py`.
