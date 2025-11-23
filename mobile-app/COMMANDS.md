# 🎯 COMMANDS TO RUN THE MOBILE APP

## Prerequisites Check
```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Check if Expo CLI is available
npx expo --version
```

---

## 🚀 QUICK START (3 Steps)

### Step 1: Navigate to Mobile App
```bash
cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app
```

### Step 2: Configure Supabase
```bash
# Create .env file
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

Add these values to `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Start the App
```bash
# Option A: Use the provided script
./start.sh

# Option B: Manual start
npm start
```

---

## 📱 RUNNING ON DIFFERENT PLATFORMS

### Method 1: Expo Go App (Easiest - No Emulator Needed)
```bash
# Start the server
npm start

# Then:
# 1. Install Expo Go on your phone
#    Android: https://play.google.com/store/apps/details?id=host.exp.exponent
#    iOS: https://apps.apple.com/app/expo-go/id982107779
# 2. Scan the QR code shown in terminal
```

### Method 2: Android Emulator
```bash
# Make sure Android Studio is installed and emulator is running
npm run android
```

### Method 3: iOS Simulator (macOS only)
```bash
npm run ios
```

### Method 4: Web Browser
```bash
npm run web
```

---

## 🛠️ DEVELOPMENT COMMANDS

### Install Dependencies
```bash
npm install
```

### Clear Cache and Restart
```bash
npm start --clear
# or
npm start -- --reset-cache
```

### Check for Errors
```bash
# TypeScript check
npx tsc --noEmit

# ESLint (if configured)
npm run lint
```

### Update Expo
```bash
npx expo upgrade
```

---

## 🏗️ BUILD COMMANDS (For Production)

### Setup EAS (Expo Application Services)
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project for building
eas build:configure
```

### Build Android APK
```bash
# Development build
eas build --platform android --profile development

# Preview build (APK for testing)
eas build --platform android --profile preview

# Production build (AAB for Play Store)
eas build --platform android --profile production
```

### Build iOS App
```bash
# Requires Apple Developer Account
eas build --platform ios --profile production
```

---

## 🔍 TROUBLESHOOTING COMMANDS

### Problem: Metro bundler won't start
```bash
cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app
npm start --clear
```

### Problem: Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problem: Expo Go won't connect
```bash
# Make sure you're on the same network
# Try restarting with tunnel mode
npm start --tunnel
```

### Problem: TypeScript errors
```bash
# Check TypeScript version
npm list typescript

# Reinstall types
npm install --save-dev @types/react @types/react-native
```

### Problem: Supabase connection fails
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables are loaded
cat .env

# Test Supabase connection (create test file)
node -e "require('dotenv').config(); console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)"
```

---

## 📊 USEFUL DEBUGGING COMMANDS

### View Logs
```bash
# Android logs
npx react-native log-android

# iOS logs
npx react-native log-ios

# Expo logs
npx expo start --dev-client
```

### Check App Info
```bash
# Show app.json configuration
cat app.json

# Show package versions
npm list --depth=0
```

### Test on Physical Device via USB
```bash
# Android
adb devices  # Check if device is connected
npm run android

# iOS (macOS only)
npm run ios --device
```

---

## 🎨 CUSTOMIZATION COMMANDS

### Add New Dependencies
```bash
# Add a package
npm install package-name

# For Expo-compatible packages
npx expo install package-name

# Example: Add icons
npx expo install @expo/vector-icons
```

### Generate Icons and Splash Screen
```bash
# Configure in app.json first, then:
npx expo prebuild
```

---

## 📦 COMMON PACKAGE INSTALLATIONS

```bash
# Navigation (Already installed)
npm install @react-navigation/native @react-navigation/native-stack

# Supabase (Already installed)
npm install @supabase/supabase-js

# Storage (Already installed)
npm install @react-native-async-storage/async-storage

# Safe Area (Already installed)
npm install react-native-safe-area-context react-native-screens

# Additional useful packages
npm install react-native-gesture-handler
npm install react-native-reanimated
npm install @expo/vector-icons
```

---

## 🔐 ENVIRONMENT SETUP

### Create .env file
```bash
cat > .env << EOF
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOF
```

### Verify .env is loaded
```bash
cat .env
```

---

## 📱 TESTING ON DIFFERENT DEVICES

### Test on Web (Quick Preview)
```bash
npm run web
# Opens in browser at http://localhost:19006
```

### Test on Android Emulator
```bash
# 1. Start Android Studio
# 2. Launch an emulator
# 3. Run:
npm run android
```

### Test on iOS Simulator (macOS)
```bash
# 1. Install Xcode from App Store
# 2. Run:
npm run ios
```

### Test on Physical Device
```bash
# 1. Install Expo Go app
# 2. Make sure phone and computer are on same WiFi
# 3. Run:
npm start
# 4. Scan QR code with Expo Go
```

---

## 🚨 EMERGENCY FIX COMMANDS

### Complete Reset
```bash
cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app

# Delete everything and start fresh
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start --clear
```

### Fix Watchman Issues (if applicable)
```bash
watchman watch-del-all
```

### Fix Metro Cache
```bash
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*
npm start --reset-cache
```

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything works:

```bash
# 1. Check files exist
ls -la src/screens/
ls -la src/lib/
ls -la .env

# 2. Verify dependencies
npm list @supabase/supabase-js
npm list @react-navigation/native
npm list react-native-safe-area-context

# 3. Start app
npm start

# 4. Test in browser
npm run web
```

---

## 🎯 QUICK COMMAND REFERENCE

| Command | Purpose |
|---------|---------|
| `npm start` | Start development server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in browser |
| `npm start --clear` | Clear cache and start |
| `npm install` | Install dependencies |
| `./start.sh` | Run quick start script |

---

## 📖 Additional Resources

- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Supabase Docs: https://supabase.com/docs
- React Navigation: https://reactnavigation.org/

---

## 🎉 YOU'RE ALL SET!

The mobile app is ready to run. Just execute:

```bash
cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app
npm start
```

Then scan the QR code with Expo Go app! 📱✨
