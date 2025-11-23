import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation, route }: Props) {
  const { onLogout } = route.params;

  const [notifications, setNotifications] = useState(true);
  const [breakfastReminder, setBreakfastReminder] = useState(false);
  const [lunchReminder, setLunchReminder] = useState(false);
  const [dinnerReminder, setDinnerReminder] = useState(false);
  const [gymReminder, setGymReminder] = useState(false);
  const [workoutReminder, setWorkoutReminder] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            onLogout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'This will delete all your local workout history and progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // In production, clear AsyncStorage or local state
            Alert.alert('Success', 'Local data cleared successfully');
          },
        },
      ]
    );
  };

  const handleSetBreakfastReminder = () => {
    Alert.alert(
      '🍳 Breakfast Reminder',
      'Choose your breakfast time:',
      [
        { text: '7:00 AM Daily', onPress: () => scheduleReminder('breakfast', '07:00', 'daily') },
        { text: '8:00 AM Daily', onPress: () => scheduleReminder('breakfast', '08:00', 'daily') },
        { text: '9:00 AM Daily', onPress: () => scheduleReminder('breakfast', '09:00', 'daily') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSetLunchReminder = () => {
    Alert.alert(
      '🍛 Lunch Reminder',
      'Choose your lunch time:',
      [
        { text: '12:00 PM Daily', onPress: () => scheduleReminder('lunch', '12:00', 'daily') },
        { text: '1:00 PM Daily', onPress: () => scheduleReminder('lunch', '13:00', 'daily') },
        { text: '2:00 PM Daily', onPress: () => scheduleReminder('lunch', '14:00', 'daily') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSetDinnerReminder = () => {
    Alert.alert(
      '🍽️ Dinner Reminder',
      'Choose your dinner time:',
      [
        { text: '7:00 PM Daily', onPress: () => scheduleReminder('dinner', '19:00', 'daily') },
        { text: '8:00 PM Daily', onPress: () => scheduleReminder('dinner', '20:00', 'daily') },
        { text: '9:00 PM Daily', onPress: () => scheduleReminder('dinner', '21:00', 'daily') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSetGymReminder = () => {
    Alert.alert(
      '🏋️ Gym Reminder',
      'Choose your gym time:',
      [
        { text: '6:00 AM Daily', onPress: () => scheduleReminder('gym', '06:00', 'daily') },
        { text: '7:00 AM Daily', onPress: () => scheduleReminder('gym', '07:00', 'daily') },
        { text: '6:00 PM Daily', onPress: () => scheduleReminder('gym', '18:00', 'daily') },
        { text: '7:00 PM Daily', onPress: () => scheduleReminder('gym', '19:00', 'daily') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSetWorkoutReminder = () => {
    Alert.alert(
      '💪 Workout Reminder',
      'Choose your workout time:',
      [
        { text: '6:00 AM Daily', onPress: () => scheduleReminder('workout', '06:00', 'daily') },
        { text: '7:00 AM Daily', onPress: () => scheduleReminder('workout', '07:00', 'daily') },
        { text: '5:00 PM Daily', onPress: () => scheduleReminder('workout', '17:00', 'daily') },
        { text: '6:00 PM Daily', onPress: () => scheduleReminder('workout', '18:00', 'daily') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const scheduleReminder = (type: string, time: string, frequency: string) => {
    // In production, use expo-notifications
    const emoji = {
      breakfast: '🍳',
      lunch: '🍛',
      dinner: '🍽️',
      gym: '🏋️',
      workout: '💪'
    }[type] || '⏰';
    
    Alert.alert('✅ Reminder Set', `${emoji} Your ${type} reminder has been scheduled for ${time} (${frequency})`);
    
    // Update state based on reminder type
    switch(type) {
      case 'breakfast':
        setBreakfastReminder(true);
        break;
      case 'lunch':
        setLunchReminder(true);
        break;
      case 'dinner':
        setDinnerReminder(true);
        break;
      case 'gym':
        setGymReminder(true);
        break;
      case 'workout':
        setWorkoutReminder(true);
        break;
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your workout and nutrition data will be exported as JSON.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // In production, export to file
            Alert.alert('Success', 'Data exported successfully! Check your downloads folder.');
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Your privacy is important to us. All data is stored securely and never shared with third parties.');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'By using B.R.A.V.O, you agree to our terms and conditions.');
  };

  const handleRateApp = () => {
    Alert.alert('Rate B.R.A.V.O', 'Thank you for your support! Please rate us on the App Store / Play Store.');
  };

  const handleHelpSupport = () => {
    Alert.alert('Help & Support', 'Need help? Contact us at support@bravo-fitness.com or visit our FAQ section.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Enable notifications for app updates
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
              thumbColor={notifications ? '#fff' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🍳 Breakfast Reminder</Text>
              <Text style={styles.settingDescription}>
                Daily reminder for breakfast
              </Text>
            </View>
            <TouchableOpacity onPress={handleSetBreakfastReminder}>
              <Switch
                value={breakfastReminder}
                onValueChange={(val) => {
                  setBreakfastReminder(val);
                  if (val) handleSetBreakfastReminder();
                }}
                trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
                thumbColor={breakfastReminder ? '#fff' : '#f3f4f6'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🍛 Lunch Reminder</Text>
              <Text style={styles.settingDescription}>
                Daily reminder for lunch
              </Text>
            </View>
            <TouchableOpacity onPress={handleSetLunchReminder}>
              <Switch
                value={lunchReminder}
                onValueChange={(val) => {
                  setLunchReminder(val);
                  if (val) handleSetLunchReminder();
                }}
                trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
                thumbColor={lunchReminder ? '#fff' : '#f3f4f6'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🍽️ Dinner Reminder</Text>
              <Text style={styles.settingDescription}>
                Daily reminder for dinner
              </Text>
            </View>
            <TouchableOpacity onPress={handleSetDinnerReminder}>
              <Switch
                value={dinnerReminder}
                onValueChange={(val) => {
                  setDinnerReminder(val);
                  if (val) handleSetDinnerReminder();
                }}
                trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
                thumbColor={dinnerReminder ? '#fff' : '#f3f4f6'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🏋️ Gym Reminder</Text>
              <Text style={styles.settingDescription}>
                Daily reminder for gym time
              </Text>
            </View>
            <TouchableOpacity onPress={handleSetGymReminder}>
              <Switch
                value={gymReminder}
                onValueChange={(val) => {
                  setGymReminder(val);
                  if (val) handleSetGymReminder();
                }}
                trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
                thumbColor={gymReminder ? '#fff' : '#f3f4f6'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>💪 Workout Reminder</Text>
              <Text style={styles.settingDescription}>
                Daily reminder for workout sessions
              </Text>
            </View>
            <TouchableOpacity onPress={handleSetWorkoutReminder}>
              <Switch
                value={workoutReminder}
                onValueChange={(val) => {
                  setWorkoutReminder(val);
                  if (val) handleSetWorkoutReminder();
                }}
                trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
                thumbColor={workoutReminder ? '#fff' : '#f3f4f6'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch to dark theme (Coming soon)
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
              thumbColor={darkMode ? '#fff' : '#f3f4f6'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds during workouts
              </Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#d1d5db', true: '#14b8a6' }}
              thumbColor={soundEffects ? '#fff' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handlePrivacyPolicy}>
            <Text style={styles.actionButtonText}>Privacy Policy</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleTermsOfService}>
            <Text style={styles.actionButtonText}>Terms of Service</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <Text style={styles.actionButtonText}>Export Data</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleClearData}
          >
            <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
              Clear Local Data
            </Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={[styles.infoValue, styles.boldBravo]}>B.R.A.V.O</Text>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={handleRateApp}>
            <Text style={styles.actionButtonText}>Rate Us</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleHelpSupport}>
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  actionArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  boldBravo: {
    fontWeight: '900',
    color: '#0d9488',
  },
});
