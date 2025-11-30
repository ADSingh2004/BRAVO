import { useState } from 'react';
import { 
  ArrowLeft, Target, Activity, Calendar, Clock, 
  TrendingUp, Edit3, Camera, Mail, MapPin, Scale, Ruler,
  Heart, Zap, Trophy, Star
} from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  profile: {
    name: string;
    goal: string;
    level: string;
    days: number;
    minutes: number;
  };
}

export default function ProfilePage({ onBack, profile }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements'>('overview');

  // Mock data for demonstration
  const userStats = {
    workoutsCompleted: 24,
    totalMinutes: 720,
    caloriesBurned: 8500,
    currentStreak: 7,
    longestStreak: 14,
    weight: 75,
    height: 175,
    bmi: 24.5,
    bodyFat: 18,
  };

  const achievements = [
    { id: 1, name: 'First Workout', description: 'Complete your first workout', earned: true, icon: '🎯' },
    { id: 2, name: 'Week Warrior', description: '7-day workout streak', earned: true, icon: '🔥' },
    { id: 3, name: 'Calorie Crusher', description: 'Burn 5000+ calories', earned: true, icon: '💪' },
    { id: 4, name: 'Month Master', description: '30-day workout streak', earned: false, icon: '👑' },
    { id: 5, name: 'Century Club', description: 'Complete 100 workouts', earned: false, icon: '💯' },
    { id: 6, name: 'Iron Will', description: 'Never skip a planned workout for 2 weeks', earned: false, icon: '🏆' },
  ];

  const recentActivity = [
    { date: 'Today', workout: 'Strength Foundation', duration: '40 min', calories: 350 },
    { date: 'Yesterday', workout: 'Cardio Power', duration: '30 min', calories: 280 },
    { date: '2 days ago', workout: 'Full Body HIIT', duration: '25 min', calories: 320 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Glassy Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-3xl" />
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
              <h1 className="text-lg lg:text-2xl font-bold text-white">My Profile</h1>
              <button className="flex items-center gap-1 lg:gap-2 text-white bg-purple-500/50 hover:bg-purple-500/70 px-3 lg:px-4 py-2 rounded-lg lg:rounded-xl backdrop-blur-sm transition-all text-sm lg:text-base">
                <Edit3 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 p-5 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col md:flex-row items-center gap-5 lg:gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl lg:text-5xl font-bold shadow-2xl">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera size={14} className="text-gray-700" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{profile.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 lg:gap-4 text-white/70 mb-3 lg:mb-4 text-sm lg:text-base">
                <span className="flex items-center gap-1">
                  <Mail size={14} />
                  <span className="truncate max-w-[150px] sm:max-w-none">{profile.name.toLowerCase()}@email.com</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  New Delhi, India
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 lg:gap-3">
                <span className="bg-purple-500/30 text-purple-200 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium">
                  🎯 {profile.goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
                <span className="bg-blue-500/30 text-blue-200 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium">
                  📊 {profile.level.charAt(0).toUpperCase() + profile.level.slice(1)}
                </span>
                <span className="bg-green-500/30 text-green-200 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium">
                  🔥 {userStats.currentStreak} Day Streak
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-center backdrop-blur-sm">
                <p className="text-2xl lg:text-3xl font-bold text-white">{userStats.workoutsCompleted}</p>
                <p className="text-white/60 text-xs lg:text-sm">Workouts</p>
              </div>
              <div className="bg-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-center backdrop-blur-sm">
                <p className="text-2xl lg:text-3xl font-bold text-white">{userStats.caloriesBurned}</p>
                <p className="text-white/60 text-xs lg:text-sm">Calories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 lg:gap-2 mb-6 lg:mb-8 overflow-x-auto pb-2">
          {(['overview', 'stats', 'achievements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold transition-all whitespace-nowrap text-sm lg:text-base ${
                activeTab === tab
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Fitness Goals */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold text-white mb-3 lg:mb-4 flex items-center gap-2">
                <Target className="text-purple-400" size={20} />
                Fitness Goals
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Primary Goal</span>
                  <span className="text-white font-medium">{profile.goal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Workouts/Week</span>
                  <span className="text-white font-medium">{profile.days} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Session Duration</span>
                  <span className="text-white font-medium">{profile.minutes} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Experience Level</span>
                  <span className="text-white font-medium capitalize">{profile.level}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-green-400" size={24} />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{activity.workout}</p>
                      <p className="text-white/50 text-sm">{activity.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{activity.duration}</p>
                      <p className="text-orange-400 text-sm">{activity.calories} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="text-blue-400" size={24} />
                Weekly Schedule
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div 
                    key={idx}
                    className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm ${
                      idx < profile.days 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-sm mt-4 text-center">
                {profile.days} workout days scheduled per week
              </p>
            </div>

            {/* Progress Summary */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-yellow-400" size={24} />
                Progress Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Weekly Goal</span>
                    <span className="text-white">5/7 workouts</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Monthly Progress</span>
                    <span className="text-white">24/30 workouts</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
              <Scale className="w-10 h-10 lg:w-12 lg:h-12 text-purple-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{userStats.weight} kg</p>
              <p className="text-white/60 text-sm">Current Weight</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
              <Ruler className="w-10 h-10 lg:w-12 lg:h-12 text-blue-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{userStats.height} cm</p>
              <p className="text-white/60 text-sm">Height</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
              <Heart className="w-10 h-10 lg:w-12 lg:h-12 text-green-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{userStats.bmi}</p>
              <p className="text-white/60 text-sm">BMI Score</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
              <Zap className="w-10 h-10 lg:w-12 lg:h-12 text-orange-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{userStats.caloriesBurned}</p>
              <p className="text-white/60 text-sm">Total Calories Burned</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
              <Clock className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{userStats.totalMinutes}</p>
              <p className="text-white/60 text-sm">Total Minutes</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 p-4 lg:p-6 text-center">
              <Trophy className="w-10 h-10 lg:w-12 lg:h-12 text-pink-400 mx-auto mb-3 lg:mb-4" />
              <p className="text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">{userStats.longestStreak}</p>
              <p className="text-white/60 text-sm">Longest Streak</p>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`relative backdrop-blur-xl rounded-xl lg:rounded-2xl border p-4 lg:p-6 transition-all ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                    : 'bg-white/5 border-white/10 opacity-60'
                }`}
              >
                {achievement.earned && (
                  <div className="absolute top-4 right-4">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </div>
                )}
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{achievement.name}</h4>
                <p className="text-white/60 text-sm">{achievement.description}</p>
                {achievement.earned && (
                  <span className="inline-block mt-4 text-yellow-400 text-sm font-medium">✓ Unlocked</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
