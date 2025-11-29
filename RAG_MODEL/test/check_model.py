import google.generativeai as genai
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
  raise EnvironmentError("GEMINI_API_KEY not set. Please update your .env file.")

genai.configure(api_key=GEMINI_API_KEY)

print("✅ Gemini API configured")
print("\n📋 Available models that support generateContent:")
print("-" * 60)
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(f"  ✓ {m.name}")
print("-" * 60)
