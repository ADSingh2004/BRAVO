#!/bin/bash
# Test script for FitGenie RAG Chatbot

echo "Testing FitGenie RAG Chatbot..."
echo ""

# Test queries
cat << 'EOF' | python app.py
What are good exercises for chest?
q
EOF
