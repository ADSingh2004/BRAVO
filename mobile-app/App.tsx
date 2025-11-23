import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import WorkoutPlanScreen from './src/screens/WorkoutPlanScreen';
import NutritionPlanScreen from './src/screens/NutritionPlanScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { OnboardingData, Profile, Plan, WorkoutPlan } from './src/types';
import { planGenerator } from './src/utils/planGenerator';

type RootStackParamList = {
  Login: undefined;
  Onboarding: { userEmail: string };
  Dashboard: undefined;
  WorkoutPlan: { workout: WorkoutPlan };
  NutritionPlan: { nutrition: any };
  EditProfile: { profile: Profile; onSave: (profile: Profile) => void };
  Settings: { onLogout: () => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    goal: '',
    level: '',
    days: 3,
    minutes: 30,
  });
  const [plan, setPlan] = useState<Plan | null>(null);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setProfile((prev) => ({ ...prev, name: email.split('@')[0] }));
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    // Update profile state
    const newProfile: Profile = {
      name: data.fullName,
      age: parseInt(data.age),
      height: parseInt(data.height),
      weight: parseInt(data.currentWeight),
      goal: data.primaryGoal,
      level: 'beginner',
      days: 5,
      minutes: 30,
    };
    setProfile(newProfile);

    // Generate workout and nutrition plan
    const planKey = `${data.primaryGoal}-beginner`;
    const workoutPlan = planGenerator.workout[planKey];
    
    // Select Indian meal plan if user prefers vegetarian/vegan diet
    const isIndianDiet = data.dietPreference === 'vegetarian' || data.dietPreference === 'vegan';
    const nutritionKey = isIndianDiet ? `${data.primaryGoal}-indian` : data.primaryGoal;
    const nutritionPlan = planGenerator.nutrition[nutritionKey] || planGenerator.nutrition[data.primaryGoal];

    if (workoutPlan && nutritionPlan) {
      setPlan({
        workout: workoutPlan,
        nutrition: nutritionPlan,
      });
    }
  };

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    
    // Regenerate plans based on updated profile
    const planKey = `${updatedProfile.goal}-${updatedProfile.level}`;
    const workoutPlan = planGenerator.workout[planKey] || planGenerator.workout[`${updatedProfile.goal}-beginner`];
    const nutritionPlan = planGenerator.nutrition[updatedProfile.goal];

    if (workoutPlan && nutritionPlan) {
      setPlan({
        workout: workoutPlan,
        nutrition: nutritionPlan,
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfile({
      name: '',
      goal: '',
      level: '',
      days: 3,
      minutes: 30,
    });
    setPlan(null);
  };

  const handleRegeneratePlan = () => {
    // Regenerate plans with current profile settings
    const planKey = `${profile.goal}-${profile.level}`;
    const workoutPlan = planGenerator.workout[planKey] || planGenerator.workout[`${profile.goal}-beginner`];
    
    // Try Indian version first, fallback to regular
    const nutritionPlanIndian = planGenerator.nutrition[`${profile.goal}-indian`];
    const nutritionPlan = nutritionPlanIndian || planGenerator.nutrition[profile.goal];

    if (workoutPlan && nutritionPlan) {
      setPlan({
        workout: workoutPlan,
        nutrition: nutritionPlan,
      });
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
          ) : !plan ? (
            <Stack.Screen name="Onboarding">
              {(props) => (
                <OnboardingScreen
                  {...props}
                  onComplete={handleOnboardingComplete}
                  userEmail={profile.name}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Dashboard">
                {(props) => (
                  <DashboardScreen
                    {...props}
                    profile={profile}
                    plan={plan}
                    onStartWorkout={() => {
                      props.navigation.navigate('WorkoutPlan', {
                        workout: plan.workout,
                      });
                    }}
                    onEditProfile={() => {
                      props.navigation.navigate('EditProfile', {
                        profile,
                        onSave: handleProfileUpdate,
                      });
                    }}
                    onSettings={() => {
                      props.navigation.navigate('Settings', {
                        onLogout: handleLogout,
                      });
                    }}
                    onRegeneratePlan={handleRegeneratePlan}
                    onViewNutrition={() => {
                      props.navigation.navigate('NutritionPlan', {
                        nutrition: plan.nutrition,
                      });
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
              <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14b8a6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});
