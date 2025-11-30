import { Sparkles, Award } from 'lucide-react';
import { Profile } from '../types';

interface SidebarProps {
  profile: Profile;
  onEditProfile: () => void;
  onSettings: () => void;
  onRegeneratePlan: () => void;
}

export default function Sidebar({ 
  profile, 
  onEditProfile, 
  onSettings, 
  onRegeneratePlan 
}: SidebarProps) {
  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl p-2">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              BRAVO
            </h1>
            <p className="text-xs text-gray-500">AI Fitness Coach</p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
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

        {/* Achievement Card */}
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

      {/* Navigation */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onEditProfile}
          className="w-full text-left text-sm text-gray-600 hover:text-gray-800 py-2"
        >
          👤 Edit Profile
        </button>
        <button 
          onClick={onSettings}
          className="w-full text-left text-sm text-gray-600 hover:text-gray-800 py-2"
        >
          ⚙️ Settings
        </button>
        <button 
          onClick={onRegeneratePlan}
          className="w-full text-left text-sm text-gray-600 hover:text-gray-800 py-2"
        >
          🔄 Regenerate Plan
        </button>
      </div>
    </div>
  );
}
