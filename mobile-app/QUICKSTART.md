# 🚀 QUICK START - 60 SECONDS TO RUNNING APP

## Copy & Paste These Commands:

```bash
# Step 1: Go to mobile app directory
cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app

# Step 2: Create .env file
cp .env.example .env

# Step 3: Edit .env (add your Supabase credentials)
nano .env

# Step 4: Start the app
npm start
```

## What to Add in .env:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxxxx.xxxxx.xxxxx
```

Get these from: **Supabase Dashboard → Settings → API**

## After `npm start`:

### Option 1: Phone (Easiest) 📱
1. Install "Expo Go" app on your phone
2. Scan the QR code shown in terminal
3. App opens automatically!

### Option 2: Web Browser 🌐
- Press `w` key in terminal
- Opens in browser at localhost:19006

### Option 3: Android Emulator 🤖
- Press `a` key in terminal
- Requires Android Studio installed

### Option 4: iOS Simulator 🍎
- Press `i` key in terminal
- macOS only, requires Xcode

---

## 🎯 That's It!

The app will show:
1. **Login Screen** (teal gradient)
2. **Onboarding Form** (profile setup)
3. **Dashboard** (workout + nutrition plans)
4. **AI Chat** (tap 💬 button)

---

## 🆘 Problems?

### App won't start?
```bash
npm start --clear
```

### Module errors?
```bash
rm -rf node_modules && npm install
```

### Can't connect to Supabase?
- Check .env file exists: `ls -la .env`
- Verify credentials are correct
- Check Supabase project is not paused

---

## 📱 Install Expo Go:

- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS**: https://apps.apple.com/app/expo-go/id982107779

---

## ✅ Features in the App:

- 🔐 Login/Signup
- 📝 Onboarding (10+ fields)
- 🏋️ Workout Plans
- 🍎 Nutrition Plans  
- 💬 AI Chat (RAG-powered)
- 🎨 Same theme as web app

---

**Total Setup Time: ~2 minutes** ⏱️

**Just add Supabase credentials and scan QR code!** 🎉
