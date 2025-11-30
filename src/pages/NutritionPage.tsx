import { useState } from 'react';
import { 
  ArrowLeft, Apple, Flame, Droplets, Coffee, Sun, Moon, 
  Plus, Check, TrendingUp, PieChart, Calendar, ChevronRight,
  Utensils, Leaf, Fish, Egg, Wheat
} from 'lucide-react';

interface NutritionPageProps {
  onBack: () => void;
  nutritionPlan: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    meals: string[];
  } | null;
}

export default function NutritionPage({ onBack, nutritionPlan }: NutritionPageProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'plan' | 'tracking'>('today');
  const [waterIntake, setWaterIntake] = useState(4);

  const defaultPlan = nutritionPlan || {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fats: 65,
    meals: [
      "Breakfast: Oatmeal with berries and almond butter",
      "Snack: Greek yogurt with honey",
      "Lunch: Grilled chicken salad with olive oil",
      "Snack: Apple with peanut butter",
      "Dinner: Baked fish with steamed broccoli and quinoa"
    ]
  };

  const mealSchedule = [
    { time: '7:00 AM', meal: 'Breakfast', icon: Coffee, color: 'from-orange-500 to-yellow-500', completed: true },
    { time: '10:00 AM', meal: 'Morning Snack', icon: Apple, color: 'from-green-500 to-teal-500', completed: true },
    { time: '1:00 PM', meal: 'Lunch', icon: Sun, color: 'from-blue-500 to-cyan-500', completed: false },
    { time: '4:00 PM', meal: 'Afternoon Snack', icon: Leaf, color: 'from-purple-500 to-pink-500', completed: false },
    { time: '7:00 PM', meal: 'Dinner', icon: Moon, color: 'from-indigo-500 to-purple-500', completed: false },
  ];

  const foodCategories = [
    { name: 'Proteins', icon: Fish, items: ['Chicken Breast', 'Salmon', 'Eggs', 'Greek Yogurt', 'Tofu'], color: 'bg-red-500' },
    { name: 'Carbs', icon: Wheat, items: ['Brown Rice', 'Oats', 'Sweet Potato', 'Quinoa', 'Whole Wheat Bread'], color: 'bg-yellow-500' },
    { name: 'Vegetables', icon: Leaf, items: ['Broccoli', 'Spinach', 'Bell Peppers', 'Carrots', 'Tomatoes'], color: 'bg-green-500' },
    { name: 'Healthy Fats', icon: Egg, items: ['Avocado', 'Olive Oil', 'Almonds', 'Walnuts', 'Chia Seeds'], color: 'bg-purple-500' },
  ];

  const weeklyProgress = [
    { day: 'Mon', calories: 2150, target: 2200 },
    { day: 'Tue', calories: 2300, target: 2200 },
    { day: 'Wed', calories: 2100, target: 2200 },
    { day: 'Thu', calories: 2250, target: 2200 },
    { day: 'Fri', calories: 2180, target: 2200 },
    { day: 'Sat', calories: 0, target: 2200 },
    { day: 'Sun', calories: 0, target: 2200 },
  ];

  const macroPercentage = {
    protein: Math.round((defaultPlan.protein * 4 / defaultPlan.calories) * 100),
    carbs: Math.round((defaultPlan.carbs * 4 / defaultPlan.calories) * 100),
    fats: Math.round((defaultPlan.fats * 9 / defaultPlan.calories) * 100),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Glassy Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-teal-600/30 backdrop-blur-3xl" />
        <div className="relative bg-white/10 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
            <div className="flex items-center justify-between gap-2">
              <button 
                onClick={onBack}
                className="flex items-center gap-1 lg:gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl backdrop-blur-sm text-sm lg:text-base"
              >
                <ArrowLeft size={18} />
                <span className="font-medium hidden sm:inline">Back</span>
              </button>
              <h1 className="text-lg lg:text-2xl font-bold text-white flex items-center gap-2">
                <Apple className="text-green-400" size={20} />
                <span className="hidden sm:inline">Nutrition Plan</span>
                <span className="sm:hidden">Nutrition</span>
              </h1>
              <button className="flex items-center gap-1 lg:gap-2 text-white bg-green-500/50 hover:bg-green-500/70 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl backdrop-blur-sm transition-all text-sm lg:text-base">
                <Plus size={16} />
                <span className="hidden sm:inline">Log Food</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Daily Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <Flame className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-2xl lg:text-3xl font-bold text-white">{defaultPlan.calories}</p>
            <p className="text-white/60 text-xs lg:text-sm">Calories Target</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-red-500 rounded-full mx-auto mb-1 lg:mb-2 flex items-center justify-center text-white text-xs font-bold">P</div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{defaultPlan.protein}g</p>
            <p className="text-white/60 text-xs lg:text-sm">Protein</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500 rounded-full mx-auto mb-1 lg:mb-2 flex items-center justify-center text-white text-xs font-bold">C</div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{defaultPlan.carbs}g</p>
            <p className="text-white/60 text-xs lg:text-sm">Carbs</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-500 rounded-full mx-auto mb-1 lg:mb-2 flex items-center justify-center text-white text-xs font-bold">F</div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{defaultPlan.fats}g</p>
            <p className="text-white/60 text-xs lg:text-sm">Fats</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 lg:gap-2 mb-6 lg:mb-8 overflow-x-auto pb-2">
          {(['today', 'plan', 'tracking'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold transition-all whitespace-nowrap text-sm lg:text-base ${
                activeTab === tab
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {tab === 'today' ? "Today's Meals" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'today' && (
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Meal Schedule */}
            <div className="lg:col-span-2 space-y-3 lg:space-y-4">
              <h3 className="text-lg lg:text-xl font-bold text-white mb-3 lg:mb-4">Meal Schedule</h3>
              {mealSchedule.map((item, idx) => {
                const Icon = item.icon;
                const mealContent = defaultPlan.meals[idx] || 'No meal planned';
                return (
                  <div 
                    key={idx}
                    className={`bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-5 flex items-center gap-3 lg:gap-4 transition-all hover:bg-white/15 ${
                      item.completed ? 'opacity-70' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold text-sm lg:text-base">{item.meal}</p>
                        <span className="text-white/50 text-xs lg:text-sm">• {item.time}</span>
                      </div>
                      <p className="text-white/70 text-xs lg:text-sm truncate">{mealContent.split(': ')[1] || mealContent}</p>
                    </div>
                    <button className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                      item.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/10 text-white/50 hover:bg-green-500/50 hover:text-white'
                    }`}>
                      <Check size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Water Tracker */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6">
                <h4 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 flex items-center gap-2">
                  <Droplets className="text-blue-400" size={18} />
                  Water Intake
                </h4>
                <div className="flex justify-center gap-1.5 lg:gap-2 mb-3 lg:mb-4">
                  {[...Array(8)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setWaterIntake(i + 1)}
                      className={`w-6 h-10 lg:w-8 lg:h-12 rounded-md lg:rounded-lg transition-all ${
                        i < waterIntake
                          ? 'bg-blue-500'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-center text-white/70">{waterIntake} / 8 glasses</p>
              </div>

              {/* Macro Breakdown */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <PieChart className="text-purple-400" />
                  Macro Split
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Protein</span>
                      <span className="text-white">{macroPercentage.protein}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${macroPercentage.protein}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Carbs</span>
                      <span className="text-white">{macroPercentage.carbs}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${macroPercentage.carbs}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Fats</span>
                      <span className="text-white">{macroPercentage.fats}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${macroPercentage.fats}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {foodCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6">
                  <h4 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 flex items-center gap-2 lg:gap-3">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 ${category.color} rounded-lg lg:rounded-xl flex items-center justify-center`}>
                      <Icon className="text-white" size={18} />
                    </div>
                    {category.name}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {category.items.map((item, i) => (
                      <span 
                        key={i}
                        className="bg-white/10 text-white/80 px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-md lg:rounded-lg text-xs lg:text-sm hover:bg-white/20 cursor-pointer transition-all"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Full Meal Plan */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Utensils className="text-orange-400" />
                Your Daily Meal Plan
              </h4>
              <div className="space-y-3">
                {defaultPlan.meals.map((meal, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-white flex-1">{meal}</p>
                    <ChevronRight className="text-white/40" size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="space-y-6">
            {/* Weekly Progress */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-400" />
                Weekly Calorie Tracking
              </h4>
              <div className="flex items-end justify-between gap-4 h-48">
                {weeklyProgress.map((day, idx) => {
                  const height = day.calories > 0 ? (day.calories / day.target) * 100 : 0;
                  const isOver = day.calories > day.target;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full h-40 bg-white/5 rounded-xl relative overflow-hidden flex items-end">
                        <div 
                          className={`w-full rounded-xl transition-all ${
                            isOver ? 'bg-red-500' : height > 0 ? 'bg-green-500' : 'bg-white/10'
                          }`}
                          style={{ height: `${Math.min(height, 100)}%` }}
                        />
                        {/* Target line */}
                        <div className="absolute w-full border-t-2 border-dashed border-white/30" style={{ bottom: '100%' }} />
                      </div>
                      <p className="text-white/70 text-sm mt-2">{day.day}</p>
                      <p className="text-white/50 text-xs">{day.calories > 0 ? day.calories : '-'}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-white/70 text-sm">On Target</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span className="text-white/70 text-sm">Over Target</span>
                </div>
              </div>
            </div>

            {/* Nutrition Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
                <Calendar className="w-8 h-8 lg:w-10 lg:h-10 text-green-400 mx-auto mb-2 lg:mb-3" />
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">85%</p>
                <p className="text-white/60 text-xs lg:text-sm">Weekly Adherence</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
                <TrendingUp className="w-8 h-8 lg:w-10 lg:h-10 text-blue-400 mx-auto mb-2 lg:mb-3" />
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">-2.5 kg</p>
                <p className="text-white/60 text-xs lg:text-sm">Weight Change</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
                <Flame className="w-8 h-8 lg:w-10 lg:h-10 text-orange-400 mx-auto mb-2 lg:mb-3" />
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">14,500</p>
                <p className="text-white/60 text-xs lg:text-sm">Avg Weekly Calories</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
