import { useState, useEffect } from 'react';
import { User, Bell, Lock, Moon, Sun, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      workoutReminders: true,
      mealReminders: true,
      progressUpdates: true,
      weeklyReports: false
    },
    appearance: {
      theme: 'light' as 'light' | 'dark',
      language: 'en'
    },
    privacy: {
      shareProgress: false,
      publicProfile: false
    },
    account: {
      units: 'metric' as 'metric' | 'imperial'
    }
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      setUserId(user.id);

      // Load user profile with settings
      // First try to select settings column
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Profile error:', profileError);
        // Column might not exist yet, just use defaults
        return;
      }

      // If settings exist and have the settings property, merge them with defaults
      if (profile && profile.settings && typeof profile.settings === 'object') {
        setSettings(prevSettings => ({
          notifications: { 
            ...prevSettings.notifications, 
            ...(profile.settings.notifications || {}) 
          },
          appearance: { 
            ...prevSettings.appearance, 
            ...(profile.settings.appearance || {}) 
          },
          privacy: { 
            ...prevSettings.privacy, 
            ...(profile.settings.privacy || {}) 
          },
          account: { 
            ...prevSettings.account, 
            ...(profile.settings.account || {}) 
          }
        }));
      }

    } catch (err: any) {
      console.error('Error loading settings:', err);
      // Don't show error to user if settings just don't exist yet
      // setError('Failed to load settings. Using defaults.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      setError('No user found. Please log in again.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Try to save settings to database
      // First check if settings column exists by attempting the update
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        // If column doesn't exist, show helpful message
        if (updateError.message.includes('column') || updateError.code === '42703') {
          console.warn('Settings column does not exist yet. Run the migration first.');
          setError('Settings feature requires database update. Please contact administrator or run database migration.');
          return;
        }
        throw updateError;
      }

      // Apply theme changes immediately
      if (settings.appearance.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Show success message
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-8 py-6 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-2xl font-bold">Settings</h2>
              <p className="text-teal-50 text-sm mt-1">Customize your FitGenie experience</p>
            </div>
            <button
              onClick={onClose}
              className="text-white text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

        <div className="p-8 space-y-8">
          {/* Notifications Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
            </div>
            <div className="space-y-3 ml-13 pl-4 border-l-2 border-gray-100">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800">Workout Reminders</p>
                  <p className="text-sm text-gray-600">Get notified when it's time to work out</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.workoutReminders}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, workoutReminders: e.target.checked }
                  })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800">Meal Reminders</p>
                  <p className="text-sm text-gray-600">Reminders for your meal plan</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.mealReminders}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, mealReminders: e.target.checked }
                  })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800">Progress Updates</p>
                  <p className="text-sm text-gray-600">Daily progress notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.progressUpdates}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, progressUpdates: e.target.checked }
                  })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800">Weekly Reports</p>
                  <p className="text-sm text-gray-600">Summary of your weekly performance</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, weeklyReports: e.target.checked }
                  })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                {settings.appearance.theme === 'light' ? (
                  <Sun className="w-5 h-5 text-purple-600" />
                ) : (
                  <Moon className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Appearance</h3>
                <p className="text-sm text-gray-600">Customize how FitGenie looks</p>
              </div>
            </div>
            <div className="space-y-3 ml-13 pl-4 border-l-2 border-gray-100">
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block mb-2">
                  <p className="font-semibold text-gray-800 mb-3">Theme</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: 'light' }
                      })}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        settings.appearance.theme === 'light'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      Light
                    </button>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: 'dark' }
                      })}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        settings.appearance.theme === 'dark'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      Dark
                    </button>
                  </div>
                </label>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block">
                  <p className="font-semibold text-gray-800 mb-3">Language</p>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, language: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Account</h3>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </div>
            </div>
            <div className="space-y-3 ml-13 pl-4 border-l-2 border-gray-100">
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block">
                  <p className="font-semibold text-gray-800 mb-3">Measurement Units</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        account: { ...settings.account, units: 'metric' }
                      })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.account.units === 'metric'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold">Metric</p>
                      <p className="text-sm text-gray-600">kg, cm</p>
                    </button>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        account: { ...settings.account, units: 'imperial' }
                      })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.account.units === 'imperial'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold">Imperial</p>
                      <p className="text-sm text-gray-600">lbs, inches</p>
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Privacy</h3>
                <p className="text-sm text-gray-600">Control your privacy settings</p>
              </div>
            </div>
            <div className="space-y-3 ml-13 pl-4 border-l-2 border-gray-100">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800">Share Progress</p>
                  <p className="text-sm text-gray-600">Allow others to see your fitness progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.shareProgress}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, shareProgress: e.target.checked }
                  })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-gray-800">Public Profile</p>
                  <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.publicProfile}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, publicProfile: e.target.checked }
                  })}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                />
              </label>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Save className="w-5 h-5" />
                  Settings Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
