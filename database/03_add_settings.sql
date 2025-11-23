-- ============================================
-- Add Settings Fields to User Profiles
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Add settings columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{
  "notifications": {
    "workoutReminders": true,
    "mealReminders": true,
    "progressUpdates": true,
    "weeklyReports": false
  },
  "appearance": {
    "theme": "light",
    "language": "en"
  },
  "privacy": {
    "shareProgress": false,
    "publicProfile": false
  },
  "account": {
    "units": "metric"
  }
}'::jsonb;

-- Create index for faster settings queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_settings ON public.user_profiles USING GIN (settings);

-- Add comment
COMMENT ON COLUMN public.user_profiles.settings IS 'User application settings stored as JSONB';
