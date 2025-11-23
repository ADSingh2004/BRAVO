import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import NutritionPlanScreen from '../screens/NutritionPlanScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WorkoutPlanScreen from '../screens/WorkoutPlanScreen';
import { Profile, NutritionPlan, WorkoutPlan } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Onboarding: { userEmail: string };
  Dashboard: undefined;
  WorkoutPlan: { workout: WorkoutPlan };
  NutritionPlan: { nutrition: NutritionPlan };
  EditProfile: { profile: Profile; onSave: (profile: Profile) => void };
  Settings: { onLogout: () => void };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
        <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
