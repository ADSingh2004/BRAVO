import { useState, useEffect } from 'react';
import { MessageCircle, Play, Sparkles, Apple, Dumbbell, Award, CheckCircle, Send } from 'lucide-react';
import { testDatabaseConnection, checkAuthStatus } from './utils/testConnection';
import WorkoutInterface from './pages/StartWorker';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import NutritionPage from './pages/NutritionPage';
import WorkoutPlanPage from './pages/WorkoutPlanPage';
import Login from './components/Login';
import ProfileForm from './components/ProfileForm';
import Settings from './components/Settings';
import EnhancedOnboarding from './components/EnhancedOnboarding';
import { bravoOrchestrator } from './services/orchestrator';
import type { ChatMessage, Exercise, Plan, Profile } from './types';

// Rules Engine for Personalized Plans
const planGenerator = {
  workout: {
    "lose-weight-beginner": {
      name: "Fat Burn Starter",
      duration: "30 min",
      exercises: [
        { name: "Warm-up Walk", sets: "1", reps: "5 min" },
        { name: "Bodyweight Squats", sets: "3", reps: "10" },
        { name: "Modified Push-ups", sets: "3", reps: "8" },
        { name: "Plank Hold", sets: "3", reps: "20 sec" },
        { name: "Walking Lunges", sets: "3", reps: "10 each" }
      ]
    },
    "lose-weight-intermediate": {
      name: "Cardio Power",
      duration: "45 min",
      exercises: [
        { name: "Jump Rope", sets: "3", reps: "2 min" },
        { name: "Burpees", sets: "4", reps: "12" },
        { name: "Mountain Climbers", sets: "4", reps: "20" },
        { name: "High Knees", sets: "3", reps: "1 min" },
        { name: "Cool-down Stretch", sets: "1", reps: "5 min" }
      ]
    },
    "build-muscle-beginner": {
      name: "Strength Foundation",
      duration: "40 min",
      exercises: [
        { name: "Goblet Squats", sets: "4", reps: "12" },
        { name: "Dumbbell Press", sets: "4", reps: "10" },
        { name: "Bent-over Rows", sets: "4", reps: "10" },
        { name: "Shoulder Press", sets: "3", reps: "10" },
        { name: "Bicep Curls", sets: "3", reps: "12" }
      ]
    },
    "build-muscle-intermediate": {
      name: "Muscle Builder Pro",
      duration: "60 min",
      exercises: [
        { name: "Barbell Squats", sets: "5", reps: "8" },
        { name: "Bench Press", sets: "5", reps: "8" },
        { name: "Deadlifts", sets: "4", reps: "6" },
        { name: "Pull-ups", sets: "4", reps: "8" },
        { name: "Dips", sets: "3", reps: "10" }
      ]
    },
    "stay-active-beginner": {
      name: "Daily Wellness",
      duration: "25 min",
      exercises: [
        { name: "Brisk Walking", sets: "1", reps: "10 min" },
        { name: "Bodyweight Squats", sets: "2", reps: "12" },
        { name: "Wall Push-ups", sets: "2", reps: "10" },
        { name: "Yoga Stretches", sets: "1", reps: "5 min" }
      ]
    }
  },
  nutrition: {
    "lose-weight": {
      calories: 1800,
      protein: 120,
      carbs: 180,
      fats: 50,
      meals: [
        "Breakfast: Oatmeal with berries and almond butter",
        "Snack: Greek yogurt with honey",
        "Lunch: Grilled chicken salad with olive oil",
        "Snack: Apple with peanut butter",
        "Dinner: Baked fish with steamed broccoli and quinoa"
      ]
    },
    "lose-weight-indian": {
      calories: 1800,
      protein: 120,
      carbs: 180,
      fats: 50,
      meals: [
        "Breakfast: Moong Dal Cheela (protein-rich lentil pancake) with mint chutney",
        "Snack: Mixed sprouts bhel with lemon and chaat masala",
        "Lunch: Grilled tandoori paneer with mixed vegetable salad",
        "Snack: Roasted makhana (foxnuts) with masala chaas",
        "Dinner: Masoor dal with methi (fenugreek) roti and stir-fried vegetables"
      ]
    },
    "build-muscle": {
      calories: 2400,
      protein: 180,
      carbs: 250,
      fats: 70,
      meals: [
        "Breakfast: Scrambled eggs with whole wheat toast and avocado",
        "Snack: Protein shake with banana",
        "Lunch: Lean beef with brown rice and mixed vegetables",
        "Snack: Cottage cheese with almonds",
        "Dinner: Grilled salmon with sweet potato and asparagus"
      ]
    },
    "build-muscle-indian": {
      calories: 2400,
      protein: 180,
      carbs: 250,
      fats: 70,
      meals: [
        "Breakfast: Paneer bhurji (scrambled paneer) with multigrain paratha and chana",
        "Morning Snack: Protein lassi with mixed nuts and banana",
        "Lunch: Chicken tikka with jeera rice and dal makhani",
        "Evening Snack: Mixed dal and nuts ladoo with masala milk",
        "Dinner: Egg curry with brown rice and palak (spinach)",
        "Night Snack: Toned milk with protein powder and turmeric"
      ]
    },
    "stay-active": {
      calories: 2200,
      protein: 140,
      carbs: 200,
      fats: 60,
      meals: [
        "Breakfast: Protein-boosted smoothie bowl (with Greek yogurt base & protein powder) and granola",
        "Morning Snack: Mixed nuts and dried fruits with hard-boiled egg whites",
        "Lunch: Turkey sandwich (extra portions) with Greek yogurt-based chicken salad",
        "Afternoon Snack: Cottage cheese or Skyr with veggie sticks",
        "Dinner: Chicken stir-fry (increased portion) with quinoa and vegetables",
        "Night Snack: Casein protein pudding or cottage cheese (for overnight recovery)"
      ]
    },
    "stay-active-indian": {
      calories: 2200,
      protein: 140,
      carbs: 200,
      fats: 60,
      meals: [
        "Breakfast: Paneer Besan Chilla with mint chutney (high-protein chickpea pancake)",
        "Morning Snack: Spiced roasted chana (chickpeas) with almonds and mixed seeds",
        "Lunch: Mixed Dal Khichdi with extra moong dal and vegetables",
        "Afternoon Snack: Masala chaas (spiced buttermilk) with makhana (foxnuts)",
        "Dinner: Soya chunks curry with multigrain roti and palak (spinach)",
        "Night Snack: Turmeric milk with protein powder or overnight soaked almonds"
      ]
    }
  }
};

// Helper function to get time-based greeting
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

export default function FitGenieApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<'landing' | 'onboarding' | 'dashboard' | 'workout' | 'profile' | 'nutrition' | 'workoutPlan'>('landing');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: '',
    goal: '',
    level: '',
    days: 3,
    minutes: 30
  });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: 'bot', text: 'Hi! I\'m your BRAVO AI coach. Ask me anything about workouts, nutrition, or wellness!', verified: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Loading state for auth check
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Theme state
  const isDark = theme === 'dark'; // Helper for conditional classes

  // Function to load user profile and plan from database
  const loadUserProfileAndPlan = async (userId: string): Promise<boolean> => {
    try {
      const { supabase } = await import('./lib/supabase');
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        // Load theme from settings if available
        if (profileData.settings?.appearance?.theme) {
          const savedTheme = profileData.settings.appearance.theme;
          setTheme(savedTheme);
          // Also apply to document for Tailwind dark mode
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }

        // Check if onboarding was completed
        const hasCompletedOnboarding = profileData.onboarding_completed === true || 
          (profileData.full_name && profileData.height_cm && profileData.weight_kg);
        
        if (hasCompletedOnboarding) {
          setProfile(prev => ({
            ...prev,
            name: profileData.full_name || prev.name
          }));
          
          // Fetch user goals to determine plan
          const { data: goalsData } = await supabase
            .from('user_goals')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();
          
          if (goalsData) {
            const goalType = goalsData.goal_type || 'build-muscle';
            setProfile(prev => ({ ...prev, goal: goalType, level: 'beginner' }));
            
            // Generate plan based on goal
            const planKey = `${goalType}-beginner` as keyof typeof planGenerator.workout;
            const workoutPlan = planGenerator.workout[planKey] || planGenerator.workout['build-muscle-beginner'];
            const nutritionPlan = planGenerator.nutrition[goalType as keyof typeof planGenerator.nutrition] || planGenerator.nutrition['build-muscle'];
            
            if (workoutPlan && nutritionPlan) {
              setPlan({ workout: workoutPlan, nutrition: nutritionPlan });
            }
          } else {
            // Default plan if no goals found
            setProfile(prev => ({ ...prev, goal: 'build-muscle', level: 'beginner' }));
            setPlan({
              workout: planGenerator.workout['build-muscle-beginner'],
              nutrition: planGenerator.nutrition['build-muscle']
            });
          }
          
          return true; // Onboarding completed
        }
      }
      return false; // Need onboarding
    } catch (err) {
      console.error('Error loading user profile:', err);
      return false;
    }
  };

  // Test database connection on mount
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing BRAVO App...');
      setIsCheckingAuth(true);
      
      // Test database connection
      const dbConnected = await testDatabaseConnection();
      if (dbConnected) {
        console.log('✅ Database ready!');
      }
      
      // Check RAG API status
      const isApiOnline = await bravoOrchestrator.checkHealth();
      setApiStatus(isApiOnline ? 'online' : 'offline');
      console.log(`🤖 BRAVO RAG API: ${isApiOnline ? 'Online' : 'Offline (using fallback)'}`);
      
      // Check if user is already logged in
      const user = await checkAuthStatus();
      if (user) {
        setIsAuthenticated(true);
        setProfile(prev => ({ ...prev, name: user.email?.split('@')[0] || 'User' }));
        
        // Load user profile and plan from database
        const hasProfile = await loadUserProfileAndPlan(user.id);
        setOnboardingCompleted(hasProfile);
      }
      
      setIsCheckingAuth(false);
    };
    
    initializeApp();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    
    // Add user message immediately
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    
    try {
      // Update orchestrator with user context
      bravoOrchestrator.setUserContext({
        goal: profile.goal,
        fitnessLevel: profile.level,
        name: profile.name,
      });
      
      // Get response from orchestrator (RAG API or fallback)
      const response = await bravoOrchestrator.sendMessage(userMessage);
      
      // Add bot response
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        text: response.response, 
        verified: response.verified ?? false 
      }]);
      
      // Update API status based on response
      const status = bravoOrchestrator.getStatus();
      setApiStatus(status.online ? 'online' : 'offline');
      
    } catch (error) {
      console.error('Error getting response:', error);
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'I apologize, but I encountered an error. Please try again.', 
        verified: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string) => {
    setIsCheckingAuth(true); // Show loading while checking profile
    setIsAuthenticated(true);
    setProfile(prev => ({ ...prev, name: email.split('@')[0] }));
    
    // Check if user has completed onboarding
    const { supabase } = await import('./lib/supabase');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const hasProfile = await loadUserProfileAndPlan(user.id);
      setOnboardingCompleted(hasProfile);
      if (hasProfile) {
        setStep('dashboard');
      } else {
        setStep('onboarding');
      }
    } else {
      setStep('onboarding');
    }
    setIsCheckingAuth(false);
  };

  // Landing Page - always show first until user clicks to proceed
  if (step === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => {
          if (isAuthenticated) {
            // User is already logged in, check if onboarding completed
            if (onboardingCompleted === true) {
              setStep('dashboard');
            } else {
              setStep('onboarding');
            }
          } else {
            // User needs to login/signup first
            setStep('onboarding');
          }
        }}
        onLogin={() => {
          if (isAuthenticated) {
            // User is already logged in, check if onboarding completed
            if (onboardingCompleted === true) {
              setStep('dashboard');
            } else {
              setStep('onboarding');
            }
          } else {
            // Show login flow
            setStep('onboarding');
          }
        }}
      />
    );
  }

  // Loading Screen - show while checking auth status
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl p-4 mb-4">
            <Sparkles className="text-white w-12 h-12 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">BRAVO</h1>
          <p className="text-white/60 text-sm">Loading your fitness journey...</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Login Screen - only show if not authenticated and past landing
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // If authenticated and onboarding is completed, skip to dashboard
  if (isAuthenticated && onboardingCompleted === true && step === 'onboarding') {
    setStep('dashboard');
    return null;
  }

  // Profile Page
  if (step === 'profile') {
    return <ProfilePage onBack={() => setStep('dashboard')} profile={profile} />;
  }

  // Nutrition Page
  if (step === 'nutrition') {
    return <NutritionPage onBack={() => setStep('dashboard')} nutritionPlan={plan?.nutrition || null} />;
  }

  // Workout Plan Page
  if (step === 'workoutPlan') {
    return <WorkoutPlanPage onBack={() => setStep('dashboard')} onStartWorkout={() => setStep('workout')} workoutPlan={plan?.workout || null} />;
  }

  // Workout Screen
  if (step === 'workout') {
    return <WorkoutInterface onBack={() => setStep('dashboard')} />;
  }

  // Onboarding Screen - only show if onboarding not completed
  if (step === 'onboarding' && onboardingCompleted !== true) {
    return (
      <EnhancedOnboarding 
        onComplete={(data) => {
          // Update profile state with enhanced data
          const newProfile = {
            name: data.fullName,
            goal: data.primaryGoal,
            level: 'beginner', // Can be enhanced based on more data
            days: 5,
            minutes: 30
          };
          setProfile(newProfile);
          
          // Generate workout and nutrition plan based on goals
          const planKey = `${data.primaryGoal}-beginner` as keyof typeof planGenerator.workout;
          const workoutPlan = planGenerator.workout[planKey];
          const nutritionPlan = planGenerator.nutrition[data.primaryGoal as keyof typeof planGenerator.nutrition];
          
          if (workoutPlan && nutritionPlan) {
            setPlan({
              workout: workoutPlan,
              nutrition: nutritionPlan
            });
          }
          
          // Mark onboarding as completed
          setOnboardingCompleted(true);
          
          // Move to dashboard after completion
          setStep('dashboard');
        }}
        userEmail={undefined} // Will be populated if coming from login
      />
    );
  }

  // Dashboard Screen
  return (
    <div className={`h-screen flex flex-col lg:flex-row overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      
      {/* Mobile Top Bar */}
      <div className={`lg:hidden flex items-center justify-between px-4 py-3 ${isDark ? 'bg-black/30 backdrop-blur-xl border-b border-white/10' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-lg p-1.5">
            <Sparkles className="text-white" size={18} />
          </div>
          <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent'}`}>BRAVO</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white p-2 rounded-lg"
          >
            <MessageCircle size={18} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile */}
      <div className={`hidden lg:flex w-72 flex-col ${isDark ? 'bg-black/30 backdrop-blur-xl border-r border-white/10' : 'bg-white border-r border-gray-200'}`}>
        <div className={`p-6 ${isDark ? 'border-b border-white/10' : 'border-b border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl p-2">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent'}`}>BRAVO</h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>AI Fitness Coach</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <button 
            onClick={() => setStep('profile')}
            className={`w-full text-left rounded-xl p-4 mb-4 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer border-2 border-transparent ${isDark ? 'bg-white/5 backdrop-blur-sm hover:border-teal-500/50' : 'bg-gradient-to-br from-teal-50 to-emerald-50 hover:border-teal-300'}`}
          >
            <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>Your Profile</p>
            <div className={`space-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>👤 {profile.name}</p>
              <p>🎯 {profile.goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
              <p>📊 {profile.level.charAt(0).toUpperCase() + profile.level.slice(1)}</p>
              <p>📅 {profile.days} days/week • {profile.minutes} min/session</p>
            </div>
          </button>

          <div className={`rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${isDark ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10' : 'bg-gradient-to-r from-purple-100 to-pink-100'}`}>
            <div className="flex items-center gap-3">
              <Award className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Getting Started! 🎉</p>
                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Complete your first workout</p>
              </div>
            </div>
          </div>

          {/* Quick Tip - Moved to sidebar */}
          <div className={`mt-4 rounded-xl p-4 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-white/10' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'}`}>
            <h4 className={`font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              💡 Quick Tip
            </h4>
            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Have questions about your plan? Click "Ask BRAVO" to chat with your AI coach!</p>
          </div>
        </div>

        <div className={`p-4 ${isDark ? 'border-t border-white/10' : 'border-t border-gray-200'}`}>
          <button 
            onClick={() => setShowProfileForm(true)}
            className={`w-full text-left text-sm py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            👤 Edit Profile
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className={`w-full text-left text-sm py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            ⚙️ Settings
          </button>
          <button 
            onClick={() => setStep('onboarding')}
            className={`w-full text-left text-sm py-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            🔄 Regenerate Plan
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar - Hidden on mobile, visible on desktop */}
        <div className={`hidden lg:flex px-4 xl:px-8 py-4 items-center justify-between ${isDark ? 'bg-black/20 backdrop-blur-md border-b border-white/10' : 'bg-white border-b border-gray-200'}`}>
          <div>
            <h2 className={`text-xl xl:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{getGreeting()}, {profile.name} 👋</h2>
            <p className={`text-xs xl:text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>"The only bad workout is the one you didn't do."</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-4 xl:px-6 py-2.5 xl:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-shadow text-sm xl:text-base"
            >
              <MessageCircle size={18} />
              <span className="hidden xl:inline">Ask BRAVO</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Mobile Greeting */}
            <div className="lg:hidden mb-4">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{getGreeting()}, {profile.name} 👋</h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>"The only bad workout is the one you didn't do."</p>
            </div>

            {/* Mobile Profile Card */}
            <button 
              onClick={() => setStep('profile')}
              className={`lg:hidden w-full text-left rounded-xl p-4 mb-4 border-2 border-transparent ${isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-gradient-to-br from-teal-50 to-emerald-50'}`}
            >
              <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-700'}`}>Your Profile</p>
              <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>👤 {profile.name}</span>
                <span>🎯 {profile.goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
              </div>
            </button>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              
              {/* Workout Plan - Clickable Card */}
              <div className="lg:col-span-2">
                <div 
                  onClick={() => setStep('workoutPlan')}
                  className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-2xl lg:rounded-3xl p-5 lg:p-8 text-white mb-4 lg:mb-6 cursor-pointer hover:shadow-2xl hover:shadow-teal-500/25 hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-start justify-between mb-4 lg:mb-6">
                    <div>
                      <p className="text-teal-100 text-xs lg:text-sm mb-1">Click to view full plan →</p>
                      <h3 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2">{plan?.workout.name}</h3>
                      <p className="text-teal-50 text-sm lg:text-base">Duration: {plan?.workout.duration}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 hidden sm:block">
                      <Dumbbell className="text-white mb-1 lg:mb-2" size={28} />
                      <p className="text-xs lg:text-sm text-teal-50">Your Plan</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6">
                    <h4 className="font-bold mb-3 lg:mb-4 text-sm lg:text-base">Today's Exercises</h4>
                    <div className="space-y-2 lg:space-y-3">
                      {plan?.workout.exercises.slice(0, 3).map((ex: Exercise, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm lg:text-base">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs lg:text-sm">
                              {i + 1}
                            </div>
                            <span className="truncate max-w-[150px] sm:max-w-none">{ex.name}</span>
                          </div>
                          <span className="text-teal-100 text-xs lg:text-sm">{ex.sets} × {ex.reps}</span>
                        </div>
                      ))}
                      {(plan?.workout.exercises.length || 0) > 3 && (
                        <p className="text-teal-200 text-xs lg:text-sm text-center pt-2">+ {(plan?.workout.exercises.length || 0) - 3} more exercises</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); setStep('workout'); }}
                    className="w-full bg-white text-teal-600 font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors text-sm lg:text-base"
                  >
                    <Play size={18} fill="currentColor" />
                    Start Workout
                  </button>
                </div>
              </div>

              {/* Nutrition Plan - Clickable Card */}
              <div>
                <div 
                  onClick={() => setStep('nutrition')}
                  className={`rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all ${isDark ? 'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-teal-500/50' : 'bg-white border border-gray-100 hover:border-green-300'}`}
                >
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h3 className={`text-lg lg:text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      <Apple className="text-red-500" size={20} />
                      Nutrition Plan
                    </h3>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Click to view →</span>
                  </div>
                  
                  <div className="mb-4 lg:mb-6">
                    <div className="flex justify-between text-xs lg:text-sm mb-2">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Daily Target</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{plan?.nutrition.calories} cal</span>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs lg:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>🥩 Protein</span>
                      <span className={`font-bold text-sm lg:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>{plan?.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs lg:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>🍞 Carbs</span>
                      <span className={`font-bold text-sm lg:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>{plan?.nutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs lg:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>🥑 Fats</span>
                      <span className={`font-bold text-sm lg:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>{plan?.nutrition.fats}g</span>
                    </div>
                  </div>

                  <div className={`pt-3 lg:pt-4 ${isDark ? 'border-t border-white/10' : 'border-t border-gray-100'}`}>
                    <p className={`text-xs lg:text-sm font-semibold mb-2 lg:mb-3 ${isDark ? 'text-white' : 'text-gray-700'}`}>Meal Suggestions</p>
                    <div className="space-y-1.5 lg:space-y-2">
                      {plan?.nutrition.meals.slice(0, 3).map((meal: string, i: number) => (
                        <div key={i} className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{meal}</span>
                        </div>
                      ))}
                      {(plan?.nutrition.meals.length || 0) > 3 && (
                        <p className="text-xs text-green-500 font-medium text-center pt-1">+ {(plan?.nutrition.meals.length || 0) - 3} more meals</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Profile Form Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 lg:p-8">
          <div className={`rounded-2xl lg:rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-4 lg:px-8 py-4 lg:py-6 rounded-t-2xl lg:rounded-t-3xl sticky top-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-lg lg:text-2xl font-bold">Edit Your Profile</h2>
                  <p className="text-teal-50 text-xs lg:text-sm mt-1">Update your personal information</p>
                </div>
                <button
                  onClick={() => setShowProfileForm(false)}
                  className="text-white text-2xl lg:text-3xl hover:bg-white/20 w-8 h-8 lg:w-10 lg:h-10 rounded-full transition-colors flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-4 lg:p-8">
              <ProfileForm isDark={isDark} />
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal (RAG-Powered) */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 lg:p-8">
          <div className={`rounded-2xl lg:rounded-3xl w-full max-w-3xl h-[90vh] lg:h-[700px] flex flex-col shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-4 lg:px-8 py-4 lg:py-6 rounded-t-2xl lg:rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-lg lg:text-2xl font-bold">Ask BRAVO AI Coach</h2>
                  <p className="text-teal-50 text-xs lg:text-sm flex items-center gap-1 lg:gap-2 mt-1">
                    <Sparkles size={12} />
                    <span className="hidden sm:inline">Powered by RAG •</span> {apiStatus === 'online' ? '🟢 AI Online' : apiStatus === 'checking' ? '🟡 Connecting...' : '🟠 Fallback Mode'}
                  </p>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white text-2xl lg:text-3xl hover:bg-white/20 w-8 h-8 lg:w-10 lg:h-10 rounded-full transition-colors flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl p-4 max-w-[80%] ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-white rounded-tr-none' 
                      : isDark 
                        ? 'bg-white/10 backdrop-blur-sm text-white rounded-tl-none border border-white/10'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    {msg.type === 'bot' && msg.verified && (
                      <span className={`text-xs mt-2 inline-flex items-center gap-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        <CheckCircle size={12} />
                        Verified Source • RAG-Powered
                      </span>
                    )}
                    {msg.type === 'bot' && !msg.verified && (
                      <span className={`text-xs mt-2 inline-flex items-center gap-1 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                        ⚡ General Response
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl rounded-tl-none p-4 ${isDark ? 'bg-white/10 backdrop-blur-sm border border-white/10' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <span className={`text-sm ml-2 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>BRAVO is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`p-4 lg:p-6 ${isDark ? 'border-t border-white/10' : 'border-t border-gray-100'}`}>
              <div className={`rounded-xl lg:rounded-2xl p-2 mb-2 lg:mb-3 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50'}`}>
                <p className={`text-xs px-2 lg:px-3 py-1 lg:py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  💡 <strong>Try:</strong> <span className="hidden sm:inline">"What can I eat instead of broccoli?" • "Alternatives for push-ups?"</span><span className="sm:hidden">"Alternatives for broccoli?"</span>
                </p>
              </div>
              <div className="flex gap-2 lg:gap-3">
                <input
                  type="text"
                  placeholder="Ask about nutrition, exercises..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  disabled={isLoading}
                  className={`flex-1 px-4 lg:px-6 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl focus:outline-none focus:border-teal-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'border-gray-200 bg-white'}`}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-4 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  <span className="hidden lg:inline">{isLoading ? 'Sending...' : 'Ask'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings 
          onClose={() => setShowSettings(false)} 
          onThemeChange={(newTheme) => setTheme(newTheme)}
          isDark={isDark}
        />
      )}

    </div>
  );
}
