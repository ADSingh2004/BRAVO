import { useState, useEffect, useMemo } from 'react';
import { Sparkles, User, Calendar, Users, Ruler, Weight, Target, Home, Dumbbell, TreePine, Heart, AlertCircle, Utensils, ArrowRight, Info, AlertTriangle, CheckCircle } from 'lucide-react';
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

// BMI Categories
type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

const getBMICategoryInfo = (category: BMICategory) => {
  switch (category) {
    case 'underweight':
      return { label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'normal':
      return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    case 'overweight':
      return { label: 'Overweight', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    case 'obese':
      return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  }
};

const getSuggestedGoal = (category: BMICategory): 'lose-weight' | 'build-muscle' | 'stay-active' => {
  switch (category) {
    case 'underweight':
      return 'build-muscle';
    case 'normal':
      return 'stay-active';
    case 'overweight':
    case 'obese':
      return 'lose-weight';
  }
};

const getHealthyWeightRange = (heightCm: number): { min: number; max: number } => {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM),
    max: Math.round(24.9 * heightM * heightM)
  };
};

export default function EnhancedOnboarding({ onComplete, userEmail }: EnhancedOnboardingProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  
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

  // Get logged-in user's email
  useEffect(() => {
    const fetchUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setLoggedInEmail(user.email);
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    };
    fetchUserEmail();
  }, []);

  // Calculate BMI
  const bmiData = useMemo(() => {
    const weight = parseFloat(formData.currentWeight);
    const height = parseFloat(formData.height);
    
    if (!weight || !height || weight <= 0 || height <= 0) return null;
    if (height < 50 || height > 300 || weight < 20 || weight > 500) return null;
    
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const category = getBMICategory(bmi);
    const categoryInfo = getBMICategoryInfo(category);
    const suggestedGoal = getSuggestedGoal(category);
    const healthyRange = getHealthyWeightRange(height);
    
    return {
      value: bmi.toFixed(1),
      category,
      categoryInfo,
      suggestedGoal,
      healthyRange
    };
  }, [formData.currentWeight, formData.height]);

  // Check for goal conflicts
  const goalWarning = useMemo(() => {
    if (!bmiData || !formData.primaryGoal) return null;
    
    const { category } = bmiData;
    
    if (category === 'underweight' && formData.primaryGoal === 'lose-weight') {
      return 'Warning: You are already underweight. Losing more weight could be harmful to your health. We recommend building muscle instead.';
    }
    
    if (category === 'obese' && formData.primaryGoal === 'build-muscle') {
      return 'Note: While building muscle is great, combining it with fat loss might give you better health results. Consider a balanced approach.';
    }
    
    return null;
  }, [bmiData, formData.primaryGoal]);

  // Check target weight validity
  const targetWeightError = useMemo(() => {
    if (!formData.targetWeight || !formData.height || !formData.currentWeight) return null;
    
    const targetWeight = parseFloat(formData.targetWeight);
    const height = parseFloat(formData.height);
    
    if (targetWeight <= 0) return 'Target weight must be positive.';
    if (height < 50 || height > 300) return null; // Invalid height, skip check
    
    const heightM = height / 100;
    const targetBMI = targetWeight / (heightM * heightM);
    const healthyRange = getHealthyWeightRange(height);
    
    if (targetBMI < 16) {
      return `Dangerous: Target weight of ${targetWeight}kg would result in a BMI of ${targetBMI.toFixed(1)}, which is severely underweight and life-threatening. Please set a healthier goal (minimum ${healthyRange.min}kg).`;
    }
    
    if (targetBMI < 18.5) {
      return `Warning: Target weight of ${targetWeight}kg would result in underweight BMI (${targetBMI.toFixed(1)}). Healthy range for your height: ${healthyRange.min}-${healthyRange.max}kg.`;
    }
    
    if (targetBMI > 40) {
      return `Target weight of ${targetWeight}kg would result in a very high BMI (${targetBMI.toFixed(1)}). Consider a healthier target.`;
    }
    
    return null;
  }, [formData.targetWeight, formData.height, formData.currentWeight]);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    // Prevent negative numbers for numeric fields
    if (['age', 'currentWeight', 'height', 'targetWeight'].includes(field)) {
      // Allow empty string for clearing
      if (value === '') {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
        setWarning(null);
        return;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        return; // Don't update if negative or invalid
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setWarning(null);
  };

  const validateForm = (): boolean => {
    // Required fields
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    
    // Email must match logged-in user
    if (loggedInEmail && formData.email.toLowerCase() !== loggedInEmail.toLowerCase()) {
      setError(`Email must match your login email (${loggedInEmail}). This ensures your data is linked to your account.`);
      return false;
    }
    
    // Age validation
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age)) {
      setError('Please enter your age.');
      return false;
    }
    if (age < 13) {
      setError('You must be at least 13 years old to use BRAVO.');
      return false;
    }
    if (age > 120) {
      setError('Please enter a valid age.');
      return false;
    }
    
    if (!formData.gender) {
      setError('Please select your gender.');
      return false;
    }
    
    // Weight validation
    const weight = parseFloat(formData.currentWeight);
    if (!formData.currentWeight || isNaN(weight)) {
      setError('Please enter your current weight.');
      return false;
    }
    if (weight < 20 || weight > 500) {
      setError('Please enter a valid weight (20-500 kg).');
      return false;
    }
    
    // Height validation
    const height = parseFloat(formData.height);
    if (!formData.height || isNaN(height)) {
      setError('Please enter your height.');
      return false;
    }
    if (height < 50 || height > 300) {
      setError('Please enter a valid height (50-300 cm). Example: 170 for 170cm.');
      return false;
    }
    
    if (!formData.primaryGoal) {
      setError('Please select your primary fitness goal.');
      return false;
    }
    
    // Target weight validation (if provided)
    if (formData.targetWeight) {
      const targetWeight = parseFloat(formData.targetWeight);
      if (isNaN(targetWeight) || targetWeight <= 0) {
        setError('Please enter a valid target weight.');
        return false;
      }
      
      const heightM = height / 100;
      const targetBMI = targetWeight / (heightM * heightM);
      
      if (targetBMI < 16) {
        setError(`Target weight ${targetWeight}kg is dangerously low (BMI: ${targetBMI.toFixed(1)}). This poses serious health risks. Please adjust your target weight.`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Show warning but allow submission if goal conflicts
    if (goalWarning && !warning) {
      setWarning(goalWarning);
      return; // User needs to confirm by clicking again
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Calculate date of birth from age
        const birthYear = new Date().getFullYear() - parseInt(formData.age);
        const dateOfBirth = new Date(birthYear, 0, 1).toISOString().split('T')[0];

        // Save to user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            full_name: formData.fullName,
            date_of_birth: dateOfBirth,
            gender: formData.gender,
            height_cm: parseFloat(formData.height),
            weight_kg: parseFloat(formData.currentWeight),
            fitness_level: 'beginner',
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        // Save goal if target weight is provided
        if (formData.targetWeight) {
          await supabase
            .from('user_goals')
            .upsert({
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
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-400 to-green-400 flex items-center justify-center p-3 sm:p-4 py-6 sm:py-8 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 my-4 sm:my-8">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
            <Sparkles className="text-white" size={36} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Welcome to BRAVO
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-2">Your AI-powered fitness companion. Let's create your personalized plan!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Warning Message */}
        {warning && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm">{warning}</p>
              <p className="text-amber-700 text-xs mt-2 font-medium">Click "Generate My Plan" again to continue anyway.</p>
            </div>
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
                  {loggedInEmail && (
                    <span className="text-xs text-gray-500 font-normal ml-2">(Must match: {loggedInEmail})</span>
                  )}
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  readOnly={!!loggedInEmail}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 ${loggedInEmail ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Age <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 font-normal ml-1">(13+)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    min="13"
                    max="120"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Weight className="w-4 h-4 inline mr-1" />
                    Current Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="70"
                    min="20"
                    max="500"
                    value={formData.currentWeight}
                    onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Height (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="170"
                    min="50"
                    max="300"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* BMI Display */}
              {bmiData && (
                <div className={`p-4 rounded-xl ${bmiData.categoryInfo.bg} ${bmiData.categoryInfo.border} border-2`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Info className={`w-5 h-5 ${bmiData.categoryInfo.color}`} />
                      <span className="font-semibold text-gray-700">Your BMI</span>
                    </div>
                    <span className={`text-2xl font-bold ${bmiData.categoryInfo.color}`}>{bmiData.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${bmiData.categoryInfo.color}`}>
                      {bmiData.categoryInfo.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      Healthy range: {bmiData.healthyRange.min}-{bmiData.healthyRange.max} kg
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-500" />
                    <span className="text-xs text-gray-600">
                      Suggested goal: <span className="font-semibold capitalize">{bmiData.suggestedGoal.replace('-', ' ')}</span>
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Target Weight (kg)
                  {bmiData && (
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      (Suggested: {bmiData.healthyRange.min}-{bmiData.healthyRange.max} kg)
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  placeholder={bmiData ? `${bmiData.healthyRange.min}` : "65"}
                  min="20"
                  max="300"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                    targetWeightError 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
                {targetWeightError && (
                  <p className="mt-2 text-sm text-red-600 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {targetWeightError}
                  </p>
                )}
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
                {bmiData && (
                  <span className="text-xs text-teal-600 font-normal ml-2">
                    (Recommended: {bmiData.suggestedGoal.replace('-', ' ')})
                  </span>
                )}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'lose-weight', label: 'Lose Weight', emoji: '🔥', icon: Weight },
                  { id: 'build-muscle', label: 'Build Muscle', emoji: '💪', icon: Dumbbell },
                  { id: 'stay-active', label: 'Stay Active', emoji: '🏃', icon: Heart }
                ].map(goal => {
                  const isRecommended = bmiData?.suggestedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleInputChange('primaryGoal', goal.id)}
                      className={`p-4 rounded-xl border-2 transition-all relative ${
                        formData.primaryGoal === goal.id
                          ? 'border-teal-500 bg-teal-50'
                          : isRecommended
                          ? 'border-teal-200 bg-teal-50/50 hover:border-teal-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {isRecommended && (
                        <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
                          ★
                        </span>
                      )}
                      <div className="text-3xl mb-2">{goal.emoji}</div>
                      <div className="text-sm font-semibold text-gray-800">{goal.label}</div>
                    </button>
                  );
                })}
              </div>
              
              {/* Goal Warning */}
              {goalWarning && formData.primaryGoal && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">{goalWarning}</p>
                </div>
              )}
            </div>
          </section>

          {/* Workout Location Section */}
          <section>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Preferred Workout Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              disabled={loading || !!(targetWeightError && targetWeightError.includes('Dangerous'))}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Your Plan...
                </>
              ) : warning ? (
                <>
                  Continue Anyway
                  <ArrowRight size={20} />
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
