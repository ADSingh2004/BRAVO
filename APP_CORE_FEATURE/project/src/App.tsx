import { useState, useEffect } from 'react';
import { MessageCircle, Play, Sparkles, Apple, Dumbbell, Award, CheckCircle, Send } from 'lucide-react';
import { testDatabaseConnection, checkAuthStatus } from './utils/testConnection';
import WorkoutInterface from './pages/StartWorker';
import Login from './components/Login';
import ProfileForm from './components/ProfileForm';
import Settings from './components/Settings';
import EnhancedOnboarding from './components/EnhancedOnboarding';

// Types
interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  verified?: boolean;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

interface WorkoutPlan {
  name: string;
  duration: string;
  exercises: Exercise[];
}

interface NutritionPlan {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: string[];
}

interface Plan {
  workout: WorkoutPlan;
  nutrition: NutritionPlan;
}

interface Profile {
  name: string;
  goal: string;
  level: string;
  days: number;
  minutes: number;
}

// Knowledge Base for RAG
const knowledgeBase = {
  nutrition_substitutes: {
    broccoli: "palak (spinach), methi (fenugreek), green beans, or gobhi (cauliflower)",
    chicken: "paneer, tofu, fish, soya chunks, or legumes",
    rice: "quinoa, daliya (broken wheat), ragi, or cauliflower rice",
    milk: "toned milk, chaas (buttermilk), lassi, or soy milk",
    protein: "whey protein, paneer, chana (chickpeas), moong dal, or masoor dal",
    yogurt: "dahi (curd), chaas (buttermilk), lassi, or paneer",
    indian_protein: "dal (lentils), rajma (kidney beans), chole (chickpeas), sprouts, or soya chunks",
    indian_breakfast: "besan chilla, moong dal cheela, paneer bhurji, or masala oats",
    indian_snacks: "roasted chana, makhana (foxnuts), mixed sprouts chat, or paneer tikka"
  },
  exercise_alternatives: {
    squats: "lunges, leg press, or step-ups",
    "push-ups": "chest press, wall push-ups, or incline push-ups",
    running: "cycling, swimming, or brisk walking",
    "pull-ups": "lat pulldown, assisted pull-ups, or resistance band rows"
  },
  safety_warnings: [
    "⚠️ IMPORTANT: If you feel sharp pain, stop immediately.",
    "⚠️ Chest pain requires immediate medical attention.",
    "⚠️ Our app provides fitness guidance, not medical advice.",
    "⚠️ Consult a doctor before starting any new exercise program."
  ]
};

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

export default function FitGenieApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<'onboarding' | 'dashboard' | 'workout'>('onboarding');
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
    { type: 'bot', text: 'Hi! I\'m your fitnessFREAK AI coach. Ask me anything about workouts, nutrition, or wellness!', verified: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Test database connection on mount
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing FitGenie App...');
      
      // Test database connection
      const dbConnected = await testDatabaseConnection();
      if (dbConnected) {
        console.log('✅ Database ready!');
      }
      
      // Check if user is already logged in
      const user = await checkAuthStatus();
      if (user) {
        setIsAuthenticated(true);
        setProfile(prev => ({ ...prev, name: user.email?.split('@')[0] || 'User' }));
      }
    };
    
    initializeApp();
  }, []);

  // RAG-powered chat response generator
  const generateRAGResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    
    // Check for safety concerns first
    if (query.includes('pain') || query.includes('hurt') || query.includes('injury')) {
      return {
        text: "⚠️ IMPORTANT: If you're experiencing pain, please stop exercising immediately and consult with a healthcare professional. Our app provides fitness guidance, not medical advice. Your safety is the top priority!",
        verified: true
      };
    }
    
    // Check for nutrition substitutes
    for (const [food, substitutes] of Object.entries(knowledgeBase.nutrition_substitutes)) {
      if (query.includes(food)) {
        return {
          text: `Based on our nutrition guide, great substitutes for ${food} include: ${substitutes}. These alternatives provide similar nutritional benefits!`,
          verified: true
        };
      }
    }
    
    // Check for exercise alternatives
    for (const [exercise, alternatives] of Object.entries(knowledgeBase.exercise_alternatives)) {
      if (query.includes(exercise)) {
        return {
          text: `Good alternatives for ${exercise} include: ${alternatives}. These exercises target similar muscle groups and can be adjusted to your fitness level.`,
          verified: true
        };
      }
    }
    
    // General fitness queries
    if (query.includes('water') || query.includes('hydrat')) {
      return {
        text: "Aim for 8-10 glasses of water daily, more if you're exercising intensely. Proper hydration improves performance and recovery!",
        verified: true
      };
    }
    
    if (query.includes('rest') || query.includes('recovery')) {
      return {
        text: "Rest days are crucial! Your muscles grow during recovery, not during workouts. Aim for at least 1-2 rest days per week, and get 7-9 hours of sleep nightly.",
        verified: true
      };
    }
    
    // Default helpful response
    return {
      text: "That's a great question! For specific medical or dietary concerns, please consult with a qualified healthcare professional. I can help with general fitness guidance, exercise alternatives, and nutrition substitutions. What would you like to know?",
      verified: true
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', text: inputMessage }]);
    
    // Generate RAG response
    const response = generateRAGResponse(inputMessage);
    
    // Add bot response after a short delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', text: response.text, verified: response.verified }]);
    }, 500);
    
    setInputMessage('');
  };

  const handleLogin = (email: string) => {
    // Here you would typically validate credentials with your backend
    setIsAuthenticated(true);
    setProfile(prev => ({ ...prev, name: email.split('@')[0] }));
    setStep('onboarding');
  };

  // Login Screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Workout Screen
  if (step === 'workout') {
    return <WorkoutInterface onBack={() => setStep('dashboard')} />;
  }

  // Onboarding Screen
  if (step === 'onboarding') {
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
          
          // Move to dashboard after completion
          setStep('dashboard');
        }}
        userEmail={undefined} // Will be populated if coming from login
      />
    );
  }

  // Dashboard Screen
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl p-2">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">fitnessFREAK</h1>
              <p className="text-xs text-gray-500">AI Fitness Coach</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Your Profile</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>👤 {profile.name}</p>
              <p>🎯 {profile.goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
              <p>📊 {profile.level.charAt(0).toUpperCase() + profile.level.slice(1)}</p>
              <p>📅 {profile.days} days/week • {profile.minutes} min/session</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Award className="text-purple-600" size={32} />
              <div>
                <p className="font-bold text-gray-800">Getting Started! 🎉</p>
                <p className="text-xs text-gray-600">Complete your first workout</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setShowProfileForm(true)}
            className="w-full text-left text-sm text-gray-600 hover:text-gray-800 py-2"
          >
            👤 Edit Profile
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full text-left text-sm text-gray-600 hover:text-gray-800 py-2"
          >
            ⚙️ Settings
          </button>
          <button 
            onClick={() => setStep('onboarding')}
            className="w-full text-left text-sm text-gray-600 hover:text-gray-800 py-2"
          >
            🔄 Regenerate Plan
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Good Morning, {profile.name} 👋</h2>
            <p className="text-sm text-gray-600 mt-1">"The only bad workout is the one you didn't do."</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              <MessageCircle size={20} />
              Ask fitnessFREAK
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Main Grid */}
            <div className="grid grid-cols-3 gap-6">
              
              {/* Workout Plan */}
              <div className="col-span-2">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-3xl p-8 text-white mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{plan?.workout.name}</h3>
                      <p className="text-teal-50">Duration: {plan?.workout.duration}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                      <Dumbbell className="text-white mb-2" size={32} />
                      <p className="text-sm text-teal-50">Your Plan</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <h4 className="font-bold mb-4">Today's Exercises</h4>
                    <div className="space-y-3">
                      {plan?.workout.exercises.map((ex: Exercise, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                              {i + 1}
                            </div>
                            <span>{ex.name}</span>
                          </div>
                          <span className="text-teal-100">{ex.sets} × {ex.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep('workout')}
                    className="w-full bg-white text-teal-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors"
                  >
                    <Play size={20} fill="currentColor" />
                    Start Workout
                  </button>
                </div>
              </div>

              {/* Nutrition Plan */}
              <div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Apple className="text-red-500" size={24} />
                    Nutrition Plan
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Daily Target</span>
                      <span className="font-bold text-gray-800">{plan?.nutrition.calories} cal</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">🥩 Protein</span>
                      <span className="font-bold">{plan?.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">🍞 Carbs</span>
                      <span className="font-bold">{plan?.nutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">🥑 Fats</span>
                      <span className="font-bold">{plan?.nutrition.fats}g</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Meal Suggestions</p>
                    <div className="space-y-2">
                      {plan?.nutrition.meals.map((meal: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{meal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h4 className="font-bold text-gray-800 mb-3">💡 Quick Tip</h4>
                  <p className="text-sm text-gray-700">Have questions about your plan? Click "Ask FitGenie" to chat with your AI coach!</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Profile Form Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-8 py-6 rounded-t-3xl sticky top-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-bold">Edit Your Profile</h2>
                  <p className="text-teal-50 text-sm mt-1">Update your personal information and fitness details</p>
                </div>
                <button
                  onClick={() => setShowProfileForm(false)}
                  className="text-white text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-8">
              <ProfileForm />
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal (RAG-Powered) */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-3xl w-full max-w-3xl h-[700px] flex flex-col shadow-2xl">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-2xl font-bold">Ask fitnessFREAK AI Coach</h2>
                  <p className="text-teal-50 text-sm flex items-center gap-2 mt-1">
                    <Sparkles size={14} />
                    Powered by RAG • Safe & Verified Responses
                  </p>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition-colors"
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
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    {msg.verified && (
                      <span className="text-xs text-green-600 mt-2 inline-flex items-center gap-1">
                        <CheckCircle size={12} />
                        Verified Source • RAG-Powered
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-2 mb-3">
                <p className="text-xs text-gray-600 px-3 py-2">
                  💡 <strong>Try asking:</strong> "What can I eat instead of broccoli?" • "Alternatives for push-ups?" • "How much water should I drink?"
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ask about nutrition, exercises, or wellness..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-teal-500 text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Send size={20} />
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}

    </div>
  );
}
