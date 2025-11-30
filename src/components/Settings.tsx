import { useState, useEffect } from 'react';
import { User, Bell, Lock, Moon, Sun, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsProps {
  onClose: () => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
  isDark?: boolean;
}

export default function Settings({ onClose, onThemeChange, isDark = false }: SettingsProps) {
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

      // Notify parent component about theme change
      if (onThemeChange) {
        onThemeChange(settings.appearance.theme);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 md:p-8">
      <div className={`rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-t-2xl sm:rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl sm:text-2xl font-bold">Settings</h2>
              <p className="text-teal-50 text-xs sm:text-sm mt-1">Customize your BRAVO experience</p>
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
          <div className="p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading settings...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className={`mx-4 sm:mx-6 md:mx-8 mt-4 sm:mt-6 p-3 sm:p-4 border-l-4 border-red-500 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <p className={isDark ? 'text-red-300 text-xs sm:text-sm' : 'text-red-800 text-xs sm:text-sm'}>{error}</p>
              </div>
            )}

        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* Notifications Section */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
                <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your notification preferences</p>
              </div>
            </div>
            <div className={`space-y-2 sm:space-y-3 ml-10 sm:ml-13 pl-3 sm:pl-4 border-l-2 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <label className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex-1 min-w-0 mr-3">
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Workout Reminders</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Get notified when it's time to work out</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.workoutReminders}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, workoutReminders: e.target.checked }
                  })}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500 flex-shrink-0"
                />
              </label>
              <label className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex-1 min-w-0 mr-3">
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Meal Reminders</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Reminders for your meal plan</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.mealReminders}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, mealReminders: e.target.checked }
                  })}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500 flex-shrink-0"
                />
              </label>
              <label className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex-1 min-w-0 mr-3">
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Progress Updates</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Daily progress notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.progressUpdates}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, progressUpdates: e.target.checked }
                  })}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500 flex-shrink-0"
                />
              </label>
              <label className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex-1 min-w-0 mr-3">
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Weekly Reports</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Summary of your weekly performance</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, weeklyReports: e.target.checked }
                  })}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500 flex-shrink-0"
                />
              </label>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                {settings.appearance.theme === 'light' ? (
                  <Sun className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                ) : (
                  <Moon className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                )}
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Appearance</h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Customize how BRAVO looks</p>
              </div>
            </div>
            <div className={`space-y-2 sm:space-y-3 ml-10 sm:ml-13 pl-3 sm:pl-4 border-l-2 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <label className="block mb-2">
                  <p className={`font-semibold text-sm sm:text-base mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Theme</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: 'light' }
                      })}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                        settings.appearance.theme === 'light'
                          ? 'border-teal-500 bg-teal-500/20'
                          : isDark ? 'border-white/20 hover:border-white/40 text-gray-300' : 'border-gray-200 hover:border-gray-300'
                      } ${isDark && settings.appearance.theme === 'light' ? 'text-white' : ''}`}
                    >
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                      Light
                    </button>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: 'dark' }
                      })}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                        settings.appearance.theme === 'dark'
                          ? 'border-teal-500 bg-teal-500/20'
                          : isDark ? 'border-white/20 hover:border-white/40 text-gray-300' : 'border-gray-200 hover:border-gray-300'
                      } ${isDark && settings.appearance.theme === 'dark' ? 'text-white' : ''}`}
                    >
                      <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Dark
                    </button>
                  </div>
                </label>
              </div>
              <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <label className="block">
                  <p className={`font-semibold text-sm sm:text-base mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Language</p>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, language: e.target.value }
                    })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:border-teal-500 text-sm sm:text-base ${isDark ? 'bg-white/5 border-white/20 text-white' : 'border-gray-200 bg-white'}`}
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
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <User className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Account</h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your account settings</p>
              </div>
            </div>
            <div className={`space-y-2 sm:space-y-3 ml-10 sm:ml-13 pl-3 sm:pl-4 border-l-2 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <label className="block">
                  <p className={`font-semibold text-sm sm:text-base mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Measurement Units</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        account: { ...settings.account, units: 'metric' }
                      })}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                        settings.account.units === 'metric'
                          ? 'border-teal-500 bg-teal-500/20'
                          : isDark ? 'border-white/20 hover:border-white/40' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Metric</p>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>kg, cm</p>
                    </button>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        account: { ...settings.account, units: 'imperial' }
                      })}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                        settings.account.units === 'imperial'
                          ? 'border-teal-500 bg-teal-500/20'
                          : isDark ? 'border-white/20 hover:border-white/40' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Imperial</p>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>lbs, inches</p>
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <Lock className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Privacy</h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Control your privacy settings</p>
              </div>
            </div>
            <div className={`space-y-2 sm:space-y-3 ml-10 sm:ml-13 pl-3 sm:pl-4 border-l-2 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <label className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex-1 min-w-0 mr-3">
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Share Progress</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Allow others to see your fitness progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.shareProgress}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, shareProgress: e.target.checked }
                  })}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500 flex-shrink-0"
                />
              </label>
              <label className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors cursor-pointer ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="flex-1 min-w-0 mr-3">
                  <p className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Public Profile</p>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Make your profile visible to other users</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.publicProfile}
                  onChange={(e) => setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, publicProfile: e.target.checked }
                  })}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 rounded focus:ring-teal-500 flex-shrink-0"
                />
              </label>
            </div>
          </section>

          {/* Save Button */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              className={`w-full sm:flex-1 py-3 sm:py-4 border-2 font-bold rounded-lg sm:rounded-xl transition-all text-sm sm:text-base ${isDark ? 'border-white/20 text-gray-300 hover:bg-white/5' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saved || saving}
              className="w-full sm:flex-1 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  Settings Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
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
