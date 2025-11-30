import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface ProfileData {
  username: string
  full_name: string
  bio: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | ''
  height_cm: number | ''
  weight_kg: number | ''
  fitness_level: 'beginner' | 'intermediate' | 'advanced' | ''
}

interface ProfileFormProps {
  onComplete?: () => void
  isDark?: boolean
}

export default function ProfileForm({ onComplete, isDark = false }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    full_name: '',
    bio: '',
    date_of_birth: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    fitness_level: ''
  })

  useEffect(() => {
    initializeProfile()
  }, [])

  const initializeProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      fetchProfile(user.id)
    }
  }

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', uid)
        .single()

      if (error) throw error

      if (data) {
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          height_cm: data.height_cm || '',
          weight_kg: data.weight_kg || '',
          fitness_level: data.fitness_level || ''
        })
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: profile.username || null,
          full_name: profile.full_name || null,
          bio: profile.bio || null,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender || null,
          height_cm: profile.height_cm || null,
          weight_kg: profile.weight_kg || null,
          fitness_level: profile.fitness_level || null
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage('✅ Profile updated successfully!')
      if (onComplete) onComplete()
    } catch (error: any) {
      setMessage('❌ Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`max-w-2xl mx-auto p-4 sm:p-6 rounded-lg ${isDark ? 'bg-transparent' : 'bg-white shadow-md'}`}>
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Complete Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Username */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Username
          </label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
            placeholder="johndoe"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Name
          </label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
            placeholder="John Doe"
          />
        </div>

        {/* Bio */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Date of Birth
          </label>
          <input
            type="date"
            value={profile.date_of_birth}
            onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white' : 'border-gray-300 bg-white'}`}
          />
        </div>

        {/* Gender */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Gender
          </label>
          <select
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white' : 'border-gray-300 bg-white'}`}
          >
            <option value="" className={isDark ? 'bg-slate-800' : ''}>Select gender</option>
            <option value="male" className={isDark ? 'bg-slate-800' : ''}>Male</option>
            <option value="female" className={isDark ? 'bg-slate-800' : ''}>Female</option>
            <option value="other" className={isDark ? 'bg-slate-800' : ''}>Other</option>
            <option value="prefer_not_to_say" className={isDark ? 'bg-slate-800' : ''}>Prefer not to say</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Height (cm)
          </label>
          <input
            type="number"
            step="0.01"
            value={profile.height_cm}
            onChange={(e) => setProfile({ ...profile, height_cm: e.target.value ? parseFloat(e.target.value) : '' })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
            placeholder="170"
          />
        </div>

        {/* Weight */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.01"
            value={profile.weight_kg}
            onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value ? parseFloat(e.target.value) : '' })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white placeholder-gray-400' : 'border-gray-300 bg-white'}`}
            placeholder="70"
          />
        </div>

        {/* Fitness Level */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Fitness Level
          </label>
          <select
            value={profile.fitness_level}
            onChange={(e) => setProfile({ ...profile, fitness_level: e.target.value as any })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-white/5 border-white/20 text-white' : 'border-gray-300 bg-white'}`}
          >
            <option value="" className={isDark ? 'bg-slate-800' : ''}>Select fitness level</option>
            <option value="beginner" className={isDark ? 'bg-slate-800' : ''}>Beginner</option>
            <option value="intermediate" className={isDark ? 'bg-slate-800' : ''}>Intermediate</option>
            <option value="advanced" className={isDark ? 'bg-slate-800' : ''}>Advanced</option>
          </select>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded ${message.includes('✅') ? (isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700') : (isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700')}`}>
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-400 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
