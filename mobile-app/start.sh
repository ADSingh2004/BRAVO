#!/bin/bash

# B.R.A.V.O Mobile App - Quick Start Script
# This script helps you set up and run the mobile app

echo "🏋️ B.R.A.V.O Mobile App - Quick Start"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in mobile-app directory"
    echo "Please run: cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app"
    exit 1
fi

echo "📦 Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔧 Step 2: Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 IMPORTANT: Please edit .env file and add your Supabase credentials:"
    echo "   - EXPO_PUBLIC_SUPABASE_URL"
    echo "   - EXPO_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    echo "You can get these from: https://app.supabase.com/project/_/settings/api"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
else
    echo "✅ .env file exists"
fi

echo ""
echo "🚀 Step 3: Starting Expo development server..."
echo ""
echo "📱 Options to run the app:"
echo "   1. Scan QR code with Expo Go app (Android/iOS)"
echo "   2. Press 'w' for web browser"
echo "   3. Press 'a' for Android emulator"
echo "   4. Press 'i' for iOS simulator (macOS only)"
echo ""

npm start
