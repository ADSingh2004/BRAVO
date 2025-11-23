# B.R.A.V.O Mobile App - Complete Setup & Implementation Guide

## 🚀 Quick Start Commands

### 1. Navigate to Mobile App Directory
```bash
cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app
```

### 2. Install Dependencies (Already Done)
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Create .env file from example
cp .env.example .env

# Edit .env and add your Supabase credentials
nano .env
```

Add your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start the Development Server
```bash
npm start
```

### 5. Run on Different Platforms

**Option A: Using Expo Go App (Recommended for Quick Testing)**
1. Install Expo Go on your phone:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779
2. Scan the QR code from the terminal

**Option B: Android Emulator**
```bash
npm run android
```

**Option C: iOS Simulator (macOS only)**
```bash
npm run ios
```

**Option D: Web Browser**
```bash
npm run web
```

## 📱 Features Implemented

### ✅ Core Features (Same as Web App)

1. **Authentication System**
   - Login with email/password
   - Sign up with email verification
   - Persistent sessions with AsyncStorage
   - Supabase integration

2. **Enhanced Onboarding**
   - Personal information collection (name, email, age, gender)
   - Body measurements (weight, height, target weight)
   - Fitness goals selection (lose weight, build muscle, stay active)
   - Workout location preferences (home, gym, outdoor)
   - Advanced options (diet preferences, injuries)
   - Data saved to Supabase

3. **Dashboard**
   - Personalized workout plans
   - Exercise lists with sets/reps
   - Nutrition plans with calorie/macro tracking
   - Meal suggestions
   - Profile summary card

4. **AI Chat (RAG-Powered)**
   - Intelligent fitness coach
   - Nutrition substitution recommendations
   - Exercise alternatives
   - Safety warnings
   - Verified, source-backed responses
   - Same knowledge base as web app

5. **Plan Generation**
   - Multiple workout plans based on goals and fitness levels
   - Customized nutrition plans
   - Indian and Western meal options
   - Calorie and macro calculations

## 🎨 Design & Theme

The mobile app uses the **exact same theme** as the web version:
- Primary Color: Teal (`#14b8a6`)
- Secondary Color: Emerald (`#10b981`)
- Gradient backgrounds
- Clean, modern UI with rounded corners
- Consistent spacing and typography

## 📂 Project Structure

```
mobile-app/
├── App.tsx                          # Main app entry with navigation logic
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Auth screen (login/signup)
│   │   ├── OnboardingScreen.tsx     # User profile setup
│   │   └── DashboardScreen.tsx      # Main dashboard
│   ├── lib/
│   │   └── supabase.ts              # Supabase client configuration
│   ├── utils/
│   │   ├── auth.ts                  # Authentication functions
│   │   └── planGenerator.ts         # Plan generation & RAG logic
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── navigation/
│       └── AppNavigator.tsx         # Navigation setup
├── package.json
├── .env.example
└── README.md
```

## 🔧 Configuration Files

### Supabase Setup
The app uses the same Supabase database as the web app:
- Database tables: `user_profiles`, `user_goals`, etc.
- RLS policies for security
- Authentication with JWT tokens

### Environment Variables Required
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📊 Comparison: Web vs Mobile

| Feature | Web App | Mobile App |
|---------|---------|------------|
| Authentication | ✅ Supabase Auth | ✅ Supabase Auth |
| Onboarding | ✅ Multi-step form | ✅ Multi-step form |
| Dashboard | ✅ Sidebar layout | ✅ Scrollable layout |
| Workout Plans | ✅ Full details | ✅ Full details |
| Nutrition Plans | ✅ Meal lists | ✅ Meal lists |
| AI Chat | ✅ Modal popup | ✅ Full-screen modal |
| RAG Knowledge | ✅ Same data | ✅ Same data |
| Theme | ✅ Teal/Emerald | ✅ Teal/Emerald |
| Profile Edit | ✅ Modal form | 🔄 Coming soon |
| Settings | ✅ Full settings | 🔄 Coming soon |
| Workout Tracker | ✅ Interactive | 🔄 Coming soon |

## 🎯 Testing the App

### 1. Test Login Flow
- Open the app
- See the login screen with teal gradient background
- Try signing up with a new email
- Try logging in with existing credentials

### 2. Test Onboarding
- After login, complete the onboarding form
- Fill in all required fields (marked with *)
- Select fitness goal (lose weight, build muscle, stay active)
- Select workout location
- Toggle advanced options
- Submit and see plan generation

### 3. Test Dashboard
- View your personalized workout plan
- Check exercise list with sets/reps
- View nutrition plan with macros
- See meal suggestions
- Tap "Ask AI" button

### 4. Test AI Chat
- Open chat modal
- Ask about nutrition substitutes
- Ask about exercise alternatives
- See verified responses with checkmarks
- Test safety-related queries

## 🐛 Troubleshooting

### Issue: Metro Bundler Won't Start
```bash
npm start --clear
```

### Issue: Module Not Found
```bash
rm -rf node_modules
npm install
```

### Issue: Supabase Connection Error
- Check `.env` file exists and has correct values
- Verify Supabase URL and key are correct
- Ensure project is not paused in Supabase dashboard

### Issue: App Crashes on Android
```bash
npm run android -- --reset-cache
```

### Issue: TypeScript Errors
```bash
npm install --save-dev @types/react@~19.1.0
```

## 🚀 Deployment

### Build for Android (APK)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Build for iOS (IPA)
```bash
# Requires Apple Developer Account
eas build --platform ios
```

## 📝 Next Steps to Enhance

1. **Add Workout Tracker Screen**
   - Timer for exercises
   - Progress tracking
   - Rest timer

2. **Add Profile Edit Screen**
   - Update personal info
   - Change fitness goals
   - Update measurements

3. **Add Settings Screen**
   - Notification preferences
   - Theme settings
   - Units (metric/imperial)

4. **Add Progress Tracking**
   - Weight history graph
   - Workout completion stats
   - Streak counter

5. **Add Social Features**
   - Share progress
   - Follow other users
   - Leaderboards

## 🔗 Related Files

- Web App: `/APP_CORE_FEATURE/project/src/`
- Database: `/APP_CORE_FEATURE/project/database/`
- RAG Model: `/RAG_MODEL/`

## 📞 Support

For questions or issues:
1. Check the README.md
2. Review Expo documentation: https://docs.expo.dev
3. Check Supabase docs: https://supabase.com/docs
4. Review React Native docs: https://reactnative.dev

---

## ✨ Summary

You now have a **fully functional mobile app** that:
- ✅ Matches the web app's design and theme
- ✅ Has all core features (auth, onboarding, dashboard, AI chat)
- ✅ Uses the same Supabase database
- ✅ Implements the same RAG-powered AI coach
- ✅ Generates personalized workout and nutrition plans
- ✅ Works on Android, iOS, and web

**Just configure your Supabase credentials and run `npm start`!** 🎉
