-- ============================================
-- S.H.AD2 Fitness App - Database Schema
-- Step 1: Create Tables
-- ============================================
-- Run this in Supabase SQL Editor
-- Make sure you're connected to your project: khsnmgqsanwtppuwgplm
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER_PROFILES TABLE
-- Extends auth.users with additional profile information
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- ============================================
-- 2. EXERCISES TABLE
-- Master list of available exercises
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    muscle_group TEXT NOT NULL,
    equipment TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    instructions TEXT[],
    video_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON public.exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON public.exercises(name);

-- ============================================
-- 3. WORKOUT_ENTRIES TABLE
-- Log of individual workout entries/sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight_kg NUMERIC(6, 2),
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workout_entries_user_id ON public.workout_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_entries_exercise_id ON public.workout_entries(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_entries_workout_date ON public.workout_entries(workout_date);
CREATE INDEX IF NOT EXISTS idx_workout_entries_user_date ON public.workout_entries(user_id, workout_date);

-- ============================================
-- 4. WORKOUT_LOGS TABLE
-- Summary of complete workout sessions
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_duration_minutes INTEGER,
    total_calories_burned NUMERIC(7, 2),
    workout_type TEXT,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_workout_date ON public.workout_logs(workout_date);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON public.workout_logs(user_id, workout_date);

-- ============================================
-- 5. NUTRITION_LOGS TABLE
-- Daily nutrition tracking
-- ============================================
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name TEXT NOT NULL,
    calories NUMERIC(7, 2),
    protein_g NUMERIC(6, 2),
    carbs_g NUMERIC(6, 2),
    fat_g NUMERIC(6, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_id ON public.nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_date ON public.nutrition_logs(date);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON public.nutrition_logs(user_id, date);

-- ============================================
-- 6. USER_PROGRESS TABLE
-- Track user progress metrics over time
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    weight_kg NUMERIC(5, 2),
    body_fat_percentage NUMERIC(4, 2),
    muscle_mass_kg NUMERIC(5, 2),
    chest_cm NUMERIC(5, 2),
    waist_cm NUMERIC(5, 2),
    hips_cm NUMERIC(5, 2),
    bicep_cm NUMERIC(5, 2),
    thigh_cm NUMERIC(5, 2),
    notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_recorded_at ON public.user_progress(recorded_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date ON public.user_progress(user_id, recorded_at);

-- ============================================
-- 7. USER_GOALS TABLE
-- User fitness goals and tracking
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'custom')),
    target_value NUMERIC(10, 2) NOT NULL,
    current_value NUMERIC(10, 2),
    target_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON public.user_goals(status);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_status ON public.user_goals(user_id, status);

-- ============================================
-- TRIGGERS
-- Automatically update updated_at timestamps
-- ============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles table
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_goals table
CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON public.user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Create profile on user signup
-- Automatically create a user profile when a user signs up
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ All 7 tables created successfully!';
    RAISE NOTICE '📋 Tables: user_profiles, exercises, workout_entries, workout_logs, nutrition_logs, user_progress, user_goals';
    RAISE NOTICE '📋 Next step: Run 02_rls_policies.sql to enable Row Level Security';
END $$;

