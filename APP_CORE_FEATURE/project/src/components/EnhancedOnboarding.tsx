import { useState } from 'react';
import { Sparkles, User, Calendar, Users, Ruler, Weight, Target, Home, Dumbbell, TreePine, Heart, AlertCircle, Utensils, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingData {
  // Personal Information
  fullName: string;
  email: string;
  age: string;
  gender: string;
  
  // Body Measurements
  currentWeight: string;
  height: string;
  targetWeight: string;
  
  // Fitness Goals
  primaryGoal: 'lose-weight' | 'build-muscle' | 'stay-active' | '';
  
  // Workout Preferences
  workoutLocation: 'home' | 'gym' | 'outdoor' | '';
  
  // Advanced Options
  dietPreference: string;
  injuries: string;
}

interface EnhancedOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  userEmail?: string;
}

export default function EnhancedOnboarding({ onComplete, userEmail }: EnhancedOnboardingProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    injuries: ''
  });

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.age || !formData.gender) {
      setError('Please fill in all required personal information fields');
      return;
    }
    
    if (!formData.currentWeight || !formData.height) {
      setError('Please fill in your body measurements');
      return;
    }
    
    if (!formData.primaryGoal) {
      setError('Please select your primary fitness goal');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            full_name: formData.fullName,
            date_of_birth: new Date(new Date().getFullYear() - parseInt(formData.age), 0, 1).toISOString().split('T')[0],
            gender: formData.gender,
            height_cm: parseFloat(formData.height),
            weight_kg: parseFloat(formData.currentWeight),
            fitness_level: 'beginner',
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        // Save goal if target weight is provided
        if (formData.targetWeight && user) {
          await supabase
            .from('user_goals')
            .insert({
              user_id: user.id,
              goal_type: formData.primaryGoal,
              target_value: parseFloat(formData.targetWeight),
              current_value: parseFloat(formData.currentWeight),
              description: `${formData.primaryGoal.replace('-', ' ')} goal`,
              status: 'active'
            });
        }
      }

      // Call parent completion handler
      onComplete(formData);
      
    } catch (err: any) {
      console.error('Error saving onboarding data:', err);
      setError('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-400 to-green-400 flex items-center justify-center p-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 my-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl p-4 mb-4">
            <Sparkles className="text-white" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to fitnessFreak
          </h1>
          <p className="text-gray-600">Your AI-powered fitness companion. Let's create your personalized plan!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          
          {/* Personal Information Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Body Measurements Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-800">Body Measurements</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="70"
                  value={formData.currentWeight}
                  onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="65"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </section>

          {/* Fitness Goals Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-800">Fitness Goals</h2>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Primary Goal <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'lose-weight', label: 'Lose Weight', emoji: '🔥', icon: Weight },
                  { id: 'build-muscle', label: 'Build Muscle', emoji: '💪', icon: Dumbbell },
                  { id: 'stay-active', label: 'Stay Active', emoji: '🏃', icon: Heart }
                ].map(goal => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => handleInputChange('primaryGoal', goal.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.primaryGoal === goal.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{goal.emoji}</div>
                    <div className="text-sm font-semibold text-gray-800">{goal.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Workout Location Section */}
          <section>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Preferred Workout Location
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'home', label: 'Home', emoji: '🏠', icon: Home },
                  { id: 'gym', label: 'Gym', emoji: '🏋️', icon: Dumbbell },
                  { id: 'outdoor', label: 'Outdoor', emoji: '🌳', icon: TreePine }
                ].map(location => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => handleInputChange('workoutLocation', location.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.workoutLocation === location.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{location.emoji}</div>
                    <div className="text-sm font-semibold text-gray-800">{location.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Advanced Options Toggle */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-6 pt-4 border-t border-gray-200">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-gray-800">Additional Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Utensils className="w-4 h-4 inline mr-1" />
                      Diet Preference
                    </label>
                    <select
                      value={formData.dietPreference}
                      onChange={(e) => handleInputChange('dietPreference', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                    >
                      <option value="">Select preference</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                      <option value="mediterranean">Mediterranean</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Injuries or Physical Limitations
                    </label>
                    <textarea
                      placeholder="Please mention any injuries, health conditions, or physical limitations..."
                      value={formData.injuries}
                      onChange={(e) => handleInputChange('injuries', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 resize-none"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Your Plan...
                </>
              ) : (
                <>
                  Generate My Personalized Plan
                  <ArrowRight size={20} />
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              * Required fields. Your data is secure and will only be used to create your fitness plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
