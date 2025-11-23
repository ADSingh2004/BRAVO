import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Vibration,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutPlan'>;

export default function WorkoutPlanScreen({ navigation, route }: Props) {
  const { workout } = route.params;
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && !isResting) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            // Vibrate when rest is complete
            Vibration.vibrate([0, 200, 100, 200]);
            return 0;
          }
          // Vibrate at 10 seconds remaining
          if (prev === 10) {
            Vibration.vibrate(100);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setTimer(0);
    setCurrentExercise(0);
  };

  const handleNextExercise = () => {
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1);
      setIsResting(true);
      setRestTimer(60); // 1 minute rest
    } else {
      handleCompleteWorkout();
    }
  };

  const handleSkipRest = () => {
    Vibration.vibrate(50);
    setIsResting(false);
    setRestTimer(0);
  };

  const handleCompleteWorkout = () => {
    setIsWorkoutActive(false);
    Alert.alert(
      '🎉 Workout Complete!',
      `Great job! You completed ${workout.name} in ${formatTime(timer)}`,
      [
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleSetReminder = () => {
    Alert.alert(
      '⏰ Set Workout Reminder',
      'Choose when you want to be reminded:',
      [
        { text: 'Tomorrow 6:00 AM', onPress: () => scheduleReminder('tomorrow', '06:00') },
        { text: 'Tomorrow 6:00 PM', onPress: () => scheduleReminder('tomorrow', '18:00') },
        { text: 'Every Day 6:00 AM', onPress: () => scheduleReminder('daily', '06:00') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const scheduleReminder = (frequency: string, time: string) => {
    // Simulate notification sound with vibration
    Vibration.vibrate([0, 100, 50, 100]);
    // In production, use expo-notifications with custom sound
    Alert.alert(
      '✅ Reminder Set',
      `🔔 Your ${frequency} workout reminder has been set for ${time}\n\n📱 You'll receive a notification with sound!`,
      [{ text: 'OK', onPress: () => Vibration.vibrate(50) }]
    );
  };

  const currentEx = workout.exercises[currentExercise];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.name}</Text>
        <TouchableOpacity style={styles.reminderButton} onPress={handleSetReminder}>
          <Text style={styles.reminderButtonText}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Info */}
        <View style={styles.infoCard}>
          <Text style={styles.duration}>⏱️ Duration: {workout.duration}</Text>
          <Text style={styles.level}>📊 Level: {workout.level || 'Beginner'}</Text>
          {isWorkoutActive && (
            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>Workout Time</Text>
              <Text style={styles.timerValue}>{formatTime(timer)}</Text>
            </View>
          )}
        </View>

        {/* Current Exercise (if active) */}
        {isWorkoutActive && (
          <View style={styles.currentExerciseCard}>
            <Text style={styles.currentLabel}>
              {isResting ? '😌 Rest Time' : '💪 Current Exercise'}
            </Text>
            {isResting ? (
              <View style={styles.restContainer}>
                <Text style={styles.restTimer}>{formatTime(restTimer)}</Text>
                <Text style={styles.restText}>Take a breather!</Text>
                <TouchableOpacity
                  style={styles.skipRestButton}
                  onPress={handleSkipRest}
                >
                  <Text style={styles.skipRestButtonText}>⏭️ Skip Rest</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.currentExerciseName}>{currentEx?.name}</Text>
                <Text style={styles.currentReps}>
                  {currentEx?.sets} sets × {currentEx?.reps} reps
                </Text>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextExercise}
                >
                  <Text style={styles.nextButtonText}>
                    {currentExercise < workout.exercises.length - 1
                      ? 'Next Exercise →'
                      : 'Complete Workout ✓'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Exercise List */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            📋 Exercise Plan ({workout.exercises.length} exercises)
          </Text>
          {workout.exercises.map((ex, i) => (
            <View
              key={i}
              style={[
                styles.exerciseCard,
                isWorkoutActive && i === currentExercise && styles.activeExerciseCard,
                isWorkoutActive && i < currentExercise && styles.completedExerciseCard,
              ]}
            >
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>
                  {isWorkoutActive && i < currentExercise ? '✓' : i + 1}
                </Text>
              </View>
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseReps}>
                  {ex.sets} sets × {ex.reps} reps
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Start Button */}
        {!isWorkoutActive && (
          <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
            <Text style={styles.startButtonText}>▶ Start Workout</Text>
          </TouchableOpacity>
        )}

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
    marginRight: 16,
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
  },
  reminderButton: {
    padding: 8,
  },
  reminderButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
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
  duration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  level: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timerCard: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14b8a6',
  },
  currentExerciseCard: {
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#14b8a6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0d9488',
    marginBottom: 12,
  },
  currentExerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  currentReps: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
  },
  restContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  restTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#14b8a6',
    marginBottom: 8,
  },
  restText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  skipRestButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  skipRestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisesSection: {
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
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activeExerciseCard: {
    backgroundColor: '#f0fdfa',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  completedExerciseCard: {
    opacity: 0.5,
  },
  exerciseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  exerciseReps: {
    fontSize: 14,
    color: '#6b7280',
  },
  startButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
