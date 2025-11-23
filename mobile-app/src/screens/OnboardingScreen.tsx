import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { OnboardingData } from '../types';
import { supabase } from '../lib/supabase';

interface OnboardingScreenProps {
  onComplete?: (data: OnboardingData) => void;
  userEmail?: string;
}

export default function OnboardingScreen({ onComplete, userEmail }: OnboardingScreenProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    email: userEmail || '',
    age: '',
    gender: '',
    currentWeight: '',
    height: '',
    targetWeight: '',
    primaryGoal: '',
    workoutLocation: '',
    dietPreference: '',
    injuries: '',
  });

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.age || !formData.gender) {
      Alert.alert('Error', 'Please fill in all required personal information fields');
      return;
    }

    if (!formData.currentWeight || !formData.height) {
      Alert.alert('Error', 'Please fill in your body measurements');
      return;
    }

    if (!formData.primaryGoal) {
      Alert.alert('Error', 'Please select your primary fitness goal');
      return;
    }

    try {
      setLoading(true);

      // Only save to database if Supabase is configured
      if (supabase) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Save to user_profiles table
          const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              id: user.id,
              full_name: formData.fullName,
              date_of_birth: new Date(
                new Date().getFullYear() - parseInt(formData.age),
                0,
                1
              )
                .toISOString()
                .split('T')[0],
              gender: formData.gender,
              height_cm: parseFloat(formData.height),
              weight_kg: parseFloat(formData.currentWeight),
              fitness_level: 'beginner',
              updated_at: new Date().toISOString(),
            });

          if (profileError) throw profileError;

          // Save goal if target weight is provided
          if (formData.targetWeight && user) {
            await supabase.from('user_goals').insert({
              user_id: user.id,
              goal_type: formData.primaryGoal,
              target_value: parseFloat(formData.targetWeight),
              current_value: parseFloat(formData.currentWeight),
              description: `${formData.primaryGoal.replace('-', ' ')} goal`,
              status: 'active',
            });
          }
        }
      } else {
        console.log('Demo mode: Data would be saved to database');
      }

      // Call parent completion handler (if provided)
      onComplete?.(formData);
    } catch (err: any) {
      console.error('Error saving onboarding data:', err);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✨</Text>
          </View>
          <Text style={styles.title}>Welcome to <Text style={styles.boldBravo}>B.R.A.V.O</Text></Text>
          <Text style={styles.subtitle}>
            Your AI-powered fitness companion. Let's create your personalized plan!
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="25"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                Gender <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.selectRow}>
                {['male', 'female', 'other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.selectButton,
                      formData.gender === gender && styles.selectButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, gender })}
                  >
                    <Text
                      style={[
                        styles.selectButtonText,
                        formData.gender === gender && styles.selectButtonTextActive,
                      ]}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Body Measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📏 Body Measurements</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Current Weight (kg) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="70"
              value={formData.currentWeight}
              onChangeText={(text) => setFormData({ ...formData, currentWeight: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Height (cm) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="170"
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="65"
              value={formData.targetWeight}
              onChangeText={(text) => setFormData({ ...formData, targetWeight: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Fitness Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🎯 Primary Goal <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.goalContainer}>
            {[
              { id: 'lose-weight', label: 'Lose Weight', emoji: '🔥' },
              { id: 'build-muscle', label: 'Build Muscle', emoji: '💪' },
              { id: 'stay-active', label: 'Stay Active', emoji: '🏃' },
            ].map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalButton,
                  formData.primaryGoal === goal.id && styles.goalButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, primaryGoal: goal.id as any })}
              >
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                <Text style={styles.goalLabel}>{goal.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏠 Preferred Workout Location</Text>
          <View style={styles.goalContainer}>
            {[
              { id: 'home', label: 'Home', emoji: '🏠' },
              { id: 'gym', label: 'Gym', emoji: '🏋️' },
              { id: 'outdoor', label: 'Outdoor', emoji: '🌳' },
            ].map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.goalButton,
                  formData.workoutLocation === location.id && styles.goalButtonActive,
                ]}
                onPress={() =>
                  setFormData({ ...formData, workoutLocation: location.id as any })
                }
              >
                <Text style={styles.goalEmoji}>{location.emoji}</Text>
                <Text style={styles.goalLabel}>{location.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Advanced Options Toggle */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>
            ✨ {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Text>
        </TouchableOpacity>

        {/* Advanced Options */}
        {showAdvanced && (
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🍽️ Diet Preference</Text>
              <View style={styles.selectRow}>
                {['vegetarian', 'vegan', 'non-vegetarian'].map((diet) => (
                  <TouchableOpacity
                    key={diet}
                    style={[
                      styles.selectButton,
                      formData.dietPreference === diet && styles.selectButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, dietPreference: diet })}
                  >
                    <Text
                      style={[
                        styles.selectButtonText,
                        formData.dietPreference === diet && styles.selectButtonTextActive,
                      ]}
                    >
                      {diet.charAt(0).toUpperCase() + diet.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>⚠️ Injuries or Physical Limitations</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Please mention any injuries, health conditions, or physical limitations..."
                value={formData.injuries}
                onChangeText={(text) => setFormData({ ...formData, injuries: text })}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Generate My Personalized Plan</Text>
              <Text style={styles.submitButtonIcon}>→</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          * Required fields. Your data is secure and will only be used to create your fitness
          plan.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14b8a6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#14b8a6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  boldBravo: {
    fontWeight: '900',
    fontSize: 30,
    color: '#0d9488',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  selectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  selectButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonActive: {
    borderColor: '#14b8a6',
    backgroundColor: '#f0fdfa',
  },
  selectButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  selectButtonTextActive: {
    color: '#14b8a6',
  },
  goalContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  goalButton: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
  },
  goalButtonActive: {
    borderColor: '#14b8a6',
    backgroundColor: '#f0fdfa',
  },
  goalEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  advancedToggle: {
    marginBottom: 16,
  },
  advancedToggleText: {
    color: '#14b8a6',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  submitButtonIcon: {
    color: '#fff',
    fontSize: 20,
  },
  disclaimer: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
});
