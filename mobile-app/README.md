# B.R.A.V.O Mobile App

A React Native mobile application built with Expo that provides AI-powered personalized fitness and nutrition plans.

## Features

- **Authentication**: Secure login and signup with Supabase
- **Personalized Onboarding**: Comprehensive user profile creation
- **AI-Powered Plans**: Custom workout and nutrition plans based on user goals
- **RAG-Powered Chat**: Intelligent fitness coach chatbot with verified responses
- **Beautiful UI**: Modern, intuitive interface matching the web app design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

## Installation

1. **Clone the repository**
   ```bash
   cd /workspaces/S.H.AD2-BitShift-Hackathon-/mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

## Running the App

### On Android
```bash
npm run android
```

### On iOS (macOS only)
```bash
npm run ios
```

### On Web
```bash
npm run web
```

### Using Expo Go
1. Install Expo Go on your device from:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in terminal after running `npm start`

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Login/Signup screen
│   │   ├── OnboardingScreen.tsx     # User profile setup
│   │   └── DashboardScreen.tsx      # Main dashboard with plans
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Navigation configuration
│   ├── lib/
│   │   └── supabase.ts              # Supabase client setup
│   ├── utils/
│   │   ├── auth.ts                  # Authentication utilities
│   │   └── planGenerator.ts         # Plan generation logic
│   └── types/
│       └── index.ts                 # TypeScript type definitions
├── App.tsx                          # Main app entry point
├── package.json
└── .env.example
```

## Core Features

### 1. Authentication
- Email/password authentication via Supabase
- Persistent session management
- Secure token storage

### 2. Onboarding
- Personal information collection
- Body measurements
- Fitness goals selection
- Workout location preferences
- Diet preferences
- Injury/limitation tracking

### 3. Dashboard
- Personalized workout plans
- Nutrition plans with macro breakdowns
- Daily meal suggestions
- Exercise lists with sets/reps
- Profile management

### 4. AI Chat
- RAG-powered fitness assistant
- Nutrition substitution suggestions
- Exercise alternatives
- Safety warnings and guidance
- Verified, source-backed responses

## Technologies Used

- **React Native**: Mobile framework
- **Expo**: Development platform
- **TypeScript**: Type-safe development
- **Supabase**: Backend & authentication
- **React Navigation**: Screen navigation
- **AsyncStorage**: Local data persistence

## Database Schema

Uses the same Supabase schema as the web app:
- `user_profiles`: User information and measurements
- `user_goals`: Fitness goals and targets
- Additional tables for workouts, nutrition tracking, etc.

## Customization

### Theme Colors
The app uses a teal/emerald gradient theme matching the web version:
- Primary: `#14b8a6` (Teal)
- Secondary: `#10b981` (Emerald)
- Accent: `#34d399` (Green)

### Plans
Workout and nutrition plans can be customized in:
```typescript
src/utils/planGenerator.ts
```

## Troubleshooting

### Metro Bundler Issues
```bash
npm start --clear
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Issues
- Verify your `.env` file has correct credentials
- Check Supabase project is active
- Ensure RLS policies are configured

## Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## Contributing

This app mirrors the functionality of the web application at `APP_CORE_FEATURE/project/`.

## Support

For issues or questions, please refer to:
- Expo Documentation: https://docs.expo.dev/
- React Native Documentation: https://reactnative.dev/
- Supabase Documentation: https://supabase.com/docs

## License

Same as the main project.
