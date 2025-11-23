import google.generativeai as genai
import os

# Configure with API key (with fallback to hardcoded key)
GEMINI_API_KEY = "AIzaSyDMcQeqPU7DnA-7GN7wneAwHeDEU8-blp8"
api_key = os.environ.get("GEMINI_API_KEY", GEMINI_API_KEY)
genai.configure(api_key=api_key)

print("✅ Gemini API configured")
print("\n📋 Available models that support generateContent:")
print("-" * 60)
for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(f"  ✓ {m.name}")
print("-" * 60)
