import { useState } from 'react';
import { 
  ArrowLeft, Dumbbell, Play, Clock, Flame, Calendar, 
  ChevronRight, Star, Filter, Search, Plus, Trophy,
  Target, Zap, Heart, TrendingUp, CheckCircle
} from 'lucide-react';

interface WorkoutPlanPageProps {
  onBack: () => void;
  onStartWorkout: () => void;
  workoutPlan: {
    name: string;
    duration: string;
    exercises: Array<{
      name: string;
      sets: string;
      reps: string;
    }>;
  } | null;
}

export default function WorkoutPlanPage({ onBack, onStartWorkout, workoutPlan }: WorkoutPlanPageProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'library' | 'history'>('today');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const defaultPlan = workoutPlan || {
    name: 'Strength Foundation',
    duration: '40 min',
    exercises: [
      { name: 'Goblet Squats', sets: '4', reps: '12' },
      { name: 'Dumbbell Press', sets: '4', reps: '10' },
      { name: 'Bent-over Rows', sets: '4', reps: '10' },
      { name: 'Shoulder Press', sets: '3', reps: '10' },
      { name: 'Bicep Curls', sets: '3', reps: '12' },
    ]
  };

  const categories = [
    { id: 'all', name: 'All', count: 50 },
    { id: 'strength', name: 'Strength', count: 18 },
    { id: 'cardio', name: 'Cardio', count: 12 },
    { id: 'hiit', name: 'HIIT', count: 8 },
    { id: 'flexibility', name: 'Flexibility', count: 7 },
    { id: 'core', name: 'Core', count: 5 },
  ];

  const workoutLibrary = [
    { 
      id: 1, 
      name: 'Full Body Blast', 
      duration: '45 min', 
      difficulty: 'Intermediate',
      calories: 400,
      exercises: 8,
      category: 'strength',
      isFavorite: true
    },
    { 
      id: 2, 
      name: 'Cardio Crusher', 
      duration: '30 min', 
      difficulty: 'Beginner',
      calories: 350,
      exercises: 6,
      category: 'cardio',
      isFavorite: false
    },
    { 
      id: 3, 
      name: 'HIIT Inferno', 
      duration: '25 min', 
      difficulty: 'Advanced',
      calories: 450,
      exercises: 10,
      category: 'hiit',
      isFavorite: true
    },
    { 
      id: 4, 
      name: 'Core Strength', 
      duration: '20 min', 
      difficulty: 'Intermediate',
      calories: 200,
      exercises: 7,
      category: 'core',
      isFavorite: false
    },
    { 
      id: 5, 
      name: 'Yoga Flow', 
      duration: '40 min', 
      difficulty: 'Beginner',
      calories: 150,
      exercises: 12,
      category: 'flexibility',
      isFavorite: false
    },
    { 
      id: 6, 
      name: 'Upper Body Power', 
      duration: '35 min', 
      difficulty: 'Intermediate',
      calories: 320,
      exercises: 6,
      category: 'strength',
      isFavorite: true
    },
  ];

  const workoutHistory = [
    { date: 'Today', name: 'Strength Foundation', duration: '42 min', calories: 365, completed: true },
    { date: 'Yesterday', name: 'Cardio Crusher', duration: '28 min', calories: 340, completed: true },
    { date: 'Nov 27', name: 'HIIT Inferno', duration: '25 min', calories: 420, completed: true },
    { date: 'Nov 26', name: 'Core Strength', duration: '18 min', calories: 185, completed: true },
    { date: 'Nov 25', name: 'Full Body Blast', duration: '45 min', calories: 395, completed: true },
  ];

  const weeklyStats = {
    workoutsCompleted: 5,
    totalMinutes: 158,
    caloriesBurned: 1705,
    streak: 7,
  };

  const filteredLibrary = selectedCategory === 'all' 
    ? workoutLibrary 
    : workoutLibrary.filter(w => w.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'Advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Glassy Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-3xl" />
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
                <Dumbbell className="text-blue-400" size={20} />
                <span className="hidden sm:inline">Workout Plans</span>
                <span className="sm:hidden">Workouts</span>
              </h1>
              <button className="flex items-center gap-1 lg:gap-2 text-white bg-blue-500/50 hover:bg-blue-500/70 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl backdrop-blur-sm transition-all text-sm lg:text-base">
                <Plus size={16} />
                <span className="hidden sm:inline">Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Weekly Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-2xl lg:text-3xl font-bold text-white">{weeklyStats.workoutsCompleted}</p>
            <p className="text-white/60 text-xs lg:text-sm">This Week</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-green-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-2xl lg:text-3xl font-bold text-white">{weeklyStats.totalMinutes}</p>
            <p className="text-white/60 text-xs lg:text-sm">Minutes</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <Flame className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-2xl lg:text-3xl font-bold text-white">{weeklyStats.caloriesBurned}</p>
            <p className="text-white/60 text-xs lg:text-sm">Calories</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
            <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-400 mx-auto mb-1 lg:mb-2" />
            <p className="text-2xl lg:text-3xl font-bold text-white">{weeklyStats.streak}</p>
            <p className="text-white/60 text-xs lg:text-sm">Day Streak</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 lg:gap-2 mb-6 lg:mb-8 overflow-x-auto pb-2">
          {(['today', 'library', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold transition-all whitespace-nowrap text-sm lg:text-base ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {tab === 'today' ? "Today's Workout" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'today' && (
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Main Workout Card */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 lg:p-8">
                  <div className="flex items-start justify-between mb-4 lg:mb-6">
                    <div>
                      <p className="text-blue-200 text-xs lg:text-sm mb-1 lg:mb-2">TODAY'S WORKOUT</p>
                      <h2 className="text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{defaultPlan.name}</h2>
                      <div className="flex items-center gap-3 lg:gap-4 text-blue-100 text-sm lg:text-base">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {defaultPlan.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell size={14} />
                          {defaultPlan.exercises.length} exercises
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 hidden sm:block">
                      <Dumbbell className="text-white" size={32} />
                    </div>
                  </div>
                  <button 
                    onClick={onStartWorkout}
                    className="w-full bg-white text-blue-600 font-bold py-3 lg:py-4 rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg text-sm lg:text-base"
                  >
                    <Play size={20} fill="currentColor" />
                    Start Workout
                  </button>
                </div>

                <div className="p-4 lg:p-6">
                  <h4 className="text-white font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Exercises</h4>
                  <div className="space-y-2 lg:space-y-3">
                    {defaultPlan.exercises.map((exercise, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-lg lg:rounded-xl hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500/30 rounded-lg lg:rounded-xl flex items-center justify-center text-blue-400 font-bold text-sm lg:text-base">
                            {idx + 1}
                          </div>
                          <span className="text-white font-medium text-sm lg:text-base truncate max-w-[140px] sm:max-w-none">{exercise.name}</span>
                        </div>
                        <span className="text-white/60 text-sm lg:text-base">{exercise.sets} × {exercise.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <h4 className="text-white font-semibold mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left">
                    <Calendar className="text-blue-400" size={20} />
                    <span className="text-white/80">Schedule Workout</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left">
                    <TrendingUp className="text-green-400" size={20} />
                    <span className="text-white/80">View Progress</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left">
                    <Heart className="text-red-400" size={20} />
                    <span className="text-white/80">Saved Workouts</span>
                  </button>
                </div>
              </div>

              {/* Tip Card */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6">
                <h4 className="text-yellow-400 font-semibold mb-2">💡 Pro Tip</h4>
                <p className="text-white/70 text-sm">
                  For best results, rest 60-90 seconds between sets and focus on proper form over speed.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Search workouts..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-white/70 hover:bg-white/20 transition-all">
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* Workout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredLibrary.map((workout) => (
                <div 
                  key={workout.id}
                  className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 overflow-hidden hover:border-blue-500/50 transition-all group cursor-pointer"
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3 lg:mb-4">
                      <div>
                        <h4 className="text-white font-bold text-base lg:text-lg mb-1">{workout.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                          {workout.difficulty}
                        </span>
                      </div>
                      <button className={`p-1.5 lg:p-2 rounded-lg transition-all ${
                        workout.isFavorite ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'
                      }`}>
                        <Star size={20} fill={workout.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {workout.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame size={14} />
                        {workout.calories} cal
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell size={14} />
                        {workout.exercises}
                      </span>
                    </div>
                    <button className="w-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-2">
                      <Play size={16} />
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  Workout History
                </h4>
              </div>
              <div className="divide-y divide-white/10">
                {workoutHistory.map((workout, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="text-green-400" size={24} />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{workout.name}</p>
                        <p className="text-white/50 text-sm">{workout.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{workout.duration}</p>
                      <p className="text-orange-400 text-sm">{workout.calories} cal</p>
                    </div>
                    <ChevronRight className="text-white/30" size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
