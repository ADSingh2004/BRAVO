import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Profile, Plan, ChatMessage } from '../types';
import { generateRAGResponse } from '../utils/planGenerator';

interface DashboardScreenProps {
  profile?: Profile;
  plan?: Plan | null;
  onStartWorkout?: () => void;
  onEditProfile?: () => void;
  onSettings?: () => void;
  onRegeneratePlan?: () => void;
  onViewNutrition?: () => void;
}

export default function DashboardScreen({
  profile,
  plan,
  onStartWorkout,
  onEditProfile,
  onSettings,
  onRegeneratePlan,
  onViewNutrition,
}: DashboardScreenProps) {
  const displayProfile: Profile = profile || {
    name: 'Guest',
    goal: 'stay-active',
    level: 'beginner',
    days: 3,
    minutes: 30,
  };
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      text: "Hi! I'm your B.R.A.V.O AI Coach 🤖\n\nI can help you with:\n💪 Workouts & Form\n🥗 Nutrition & Meals\n🎯 Weight Loss/Muscle Gain\n⏰ Pre/Post Workout Nutrition\n💊 Supplements\n😴 Recovery & Sleep\n🧘 Stretching & Mobility\n\nAsk me anything!",
      verified: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickQuestions = [
    "How to lose weight?",
    "Best pre-workout meal?",
    "How much protein?",
    "Alternatives for push-ups?",
    "When to workout?",
    "How to build muscle?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const handleClearChat = () => {
    Alert.alert(
      '🗑️ Clear Chat History',
      'Are you sure you want to delete all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setChatMessages([
              {
                type: 'bot',
                text: "Hi! I'm your B.R.A.V.O AI Coach 🤖\n\nI can help you with:\n💪 Workouts & Form\n🥗 Nutrition & Meals\n🎯 Weight Loss/Muscle Gain\n⏰ Pre/Post Workout Nutrition\n💊 Supplements\n😴 Recovery & Sleep\n🧘 Stretching & Mobility\n\nAsk me anything!",
                verified: true,
              },
            ]);
          },
        },
      ]
    );
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const messageToSend = inputMessage;
    setInputMessage(''); // Clear input immediately

    // Add user message
    setChatMessages((prev) => [...prev, { type: 'user', text: messageToSend }]);

    // Generate RAG response
    const response = generateRAGResponse(messageToSend);

    // Add bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { type: 'bot', text: response.text, verified: response.verified },
      ]);
    }, 500);
  };

  const handleRegeneratePlan = () => {
    Alert.alert(
      '🔄 Regenerate Plan',
      'Generate a new personalized workout and nutrition plan based on your current profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: () => {
            onRegeneratePlan?.();
            Alert.alert('✅ Success', 'Your new plan has been generated!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, {displayProfile.name} 👋</Text>
          <Text style={styles.quote}>"The only bad workout is the one you didn't do."</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={() => setShowChat(true)}>
          <Text style={styles.chatButtonText}>💬 Ask AI</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.cardTitle}>Your Profile</Text>
            <Text style={styles.profileText}>👤 {displayProfile.name}</Text>
          <Text style={styles.profileText}>
            🎯 {displayProfile.goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </Text>
          <Text style={styles.profileText}>
            📊 {displayProfile.level.charAt(0).toUpperCase() + displayProfile.level.slice(1)}
          </Text>
          <Text style={styles.profileText}>
            📅 {displayProfile.days} days/week • {displayProfile.minutes} min/session
          </Text>
        </View>

        {/* Workout Plan Card */}
        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View>
              <Text style={styles.workoutTitle}>{plan?.workout.name ?? 'Workout'}</Text>
              <Text style={styles.workoutDuration}>Duration: {plan?.workout.duration ?? '--'}</Text>
            </View>
            <View style={styles.workoutIcon}>
              <Text style={styles.workoutIconText}>🏋️</Text>
            </View>
          </View>

          <View style={styles.exerciseList}>
            <Text style={styles.exerciseTitle}>Today's Exercises</Text>
            {(plan?.workout.exercises || []).map((ex, i) => (
              <View key={i} style={styles.exerciseItem}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseReps}>
                  {ex.sets} × {ex.reps}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startButton} onPress={() => onStartWorkout?.()}>
            <Text style={styles.startButtonText}>▶ Start Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrition Card */}
        <TouchableOpacity onPress={() => onViewNutrition?.()}>
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>🍎 NUTRITION PLAN</Text>

            <View style={styles.caloriesRow}>
              <Text style={styles.caloriesLabel}>Daily Target</Text>
              <Text style={styles.caloriesValue}>{plan?.nutrition.dailyCalories ?? '--'} cal</Text>
            </View>

            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>🥩 Protein</Text>
                  <Text style={styles.macroValue}>{plan?.nutrition.macros.protein ?? '--'}g</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>🍞 Carbs</Text>
                <Text style={styles.macroValue}>{plan?.nutrition.macros.carbs ?? '--'}g</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>🥑 Fats</Text>
                <Text style={styles.macroValue}>{plan?.nutrition.macros.fats ?? '--'}g</Text>
              </View>
            </View>

            <View style={styles.mealsContainer}>
              <Text style={styles.mealsTitle}>Meal Suggestions</Text>
              {(plan?.nutrition.meals || []).slice(0, 3).map((meal, i) => (
                <View key={i} style={styles.mealItem}>
                  <Text style={styles.mealCheck}>✓</Text>
                  <Text style={styles.mealText}>{meal}</Text>
                </View>
              ))}
              <Text style={styles.viewMoreText}>Tap to view full plan →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEditProfile?.()}>
            <Text style={styles.actionButtonText}>👤 Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onSettings?.()}>
            <Text style={styles.actionButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleRegeneratePlan}>
            <Text style={styles.actionButtonText}>🔄 Regenerate Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Chat Modal */}
      <Modal visible={showChat} animationType="slide" onRequestClose={() => setShowChat(false)}>
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatHeaderTitle}>Ask <Text style={styles.boldBravo}>B.R.A.V.O</Text> AI Coach</Text>
              <Text style={styles.chatHeaderSubtitle}>✨ Powered by RAG • Safe & Verified</Text>
            </View>
            <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>🗑️ Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Text style={styles.chatClose}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatMessages}>
            {chatMessages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.messageContainer,
                  msg.type === 'user' ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
                {msg.verified && (
                  <Text style={styles.verifiedBadge}>✓ Verified Source • RAG-Powered</Text>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Quick Question Chips */}
          {chatMessages.length === 1 && (
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>Try asking:</Text>
              <View style={styles.quickQuestionsChips}>
                {quickQuestions.map((q, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.quickQuestionChip}
                    onPress={() => handleQuickQuestion(q)}
                  >
                    <Text style={styles.quickQuestionText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask about nutrition, exercises, or wellness..."
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  chatButton: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#f0fdfa',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#115e59',
    marginBottom: 8,
  },
  profileText: {
    fontSize: 12,
    color: '#134e4a',
    marginBottom: 4,
  },
  workoutCard: {
    backgroundColor: '#14b8a6',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#ccfbf1',
    marginTop: 4,
  },
  workoutIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutIconText: {
    fontSize: 32,
  },
  exerciseList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exerciseName: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  exerciseReps: {
    color: '#ccfbf1',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#14b8a6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nutritionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  caloriesValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  macrosContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  macroItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  macroValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  mealsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  mealsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  mealItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  mealCheck: {
    color: '#10b981',
    marginRight: 8,
    fontSize: 14,
  },
  mealText: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#14b8a6',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  actionsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    backgroundColor: '#14b8a6',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: '#ccfbf1',
    marginTop: 4,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chatClose: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '300',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#14b8a6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#1f2937',
  },
  verifiedBadge: {
    fontSize: 10,
    color: '#10b981',
    marginTop: 8,
  },
  quickQuestionsContainer: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  quickQuestionsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickQuestionChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#14b8a6',
    marginRight: 8,
    marginBottom: 8,
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#14b8a6',
    fontWeight: '500',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  boldBravo: {
    fontWeight: '900',
    color: '#0d9488',
  },
});
