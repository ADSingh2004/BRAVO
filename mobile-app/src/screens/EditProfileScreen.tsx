import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation, route }: Props) {
  const { profile, onSave } = route.params;

  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age?.toString() || '',
    height: profile.height?.toString() || '',
    weight: profile.weight?.toString() || '',
    goal: profile.goal,
    level: profile.level,
    days: profile.days?.toString() || '3',
    minutes: profile.minutes?.toString() || '30',
  });

  const handleSave = () => {
    // Validate required fields
    if (!formData.name || !formData.age || !formData.height || !formData.weight) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedProfile = {
      ...profile,
      name: formData.name,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      goal: formData.goal,
      level: formData.level,
      days: parseInt(formData.days),
      minutes: parseInt(formData.minutes),
    };

    onSave(updatedProfile);
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
        </View>

        {/* Physical Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Stats</Text>
          
          <Text style={styles.label}>Height (cm) *</Text>
          <TextInput
            style={styles.input}
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            placeholder="Enter height in cm"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Weight (kg) *</Text>
          <TextInput
            style={styles.input}
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            placeholder="Enter weight in kg"
            keyboardType="numeric"
          />
        </View>

        {/* Fitness Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Goals</Text>
          
          <Text style={styles.label}>Primary Goal</Text>
          <View style={styles.optionsContainer}>
            {['weight_loss', 'muscle_gain', 'general_fitness', 'endurance'].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.optionButton,
                  formData.goal === goal && styles.optionButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, goal })}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.goal === goal && styles.optionTextActive,
                  ]}
                >
                  {goal.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Fitness Level</Text>
          <View style={styles.optionsContainer}>
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  formData.level === level && styles.optionButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, level })}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.level === level && styles.optionTextActive,
                  ]}
                >
                  {level.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Preferences</Text>
          
          <Text style={styles.label}>Days per Week</Text>
          <TextInput
            style={styles.input}
            value={formData.days}
            onChangeText={(text) => setFormData({ ...formData, days: text })}
            placeholder="Number of days"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Minutes per Session</Text>
          <TextInput
            style={styles.input}
            value={formData.minutes}
            onChangeText={(text) => setFormData({ ...formData, minutes: text })}
            placeholder="Duration in minutes"
            keyboardType="numeric"
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#14b8a6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#14b8a6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  optionButtonActive: {
    borderColor: '#14b8a6',
    backgroundColor: '#14b8a6',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  optionTextActive: {
    color: '#fff',
  },
});
