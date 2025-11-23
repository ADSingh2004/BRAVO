-- ============================================
-- S.H.AD2 Fitness App - Row Level Security Policies
-- Step 2: Enable RLS and Create Policies
-- ============================================
-- Run this AFTER running 01_create_tables.sql
-- ============================================

-- ============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER_PROFILES TABLE POLICIES
-- Users can view and update their own profile
-- ============================================

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Allow users to view other public profiles (for social features)
CREATE POLICY "Users can view public profiles"
    ON public.user_profiles
    FOR SELECT
    USING (true);

-- ============================================
-- EXERCISES TABLE POLICIES
-- All authenticated users can view exercises
-- ============================================

-- Allow all authenticated users to view exercises
CREATE POLICY "Authenticated users can view exercises"
    ON public.exercises
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to suggest exercises
CREATE POLICY "Authenticated users can insert exercises"
    ON public.exercises
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================
-- WORKOUT_ENTRIES TABLE POLICIES
-- Users can CRUD their own workout entries
-- ============================================

-- Allow users to view their own workout entries
CREATE POLICY "Users can view own workout entries"
    ON public.workout_entries
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own workout entries
CREATE POLICY "Users can insert own workout entries"
    ON public.workout_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own workout entries
CREATE POLICY "Users can update own workout entries"
    ON public.workout_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own workout entries
CREATE POLICY "Users can delete own workout entries"
    ON public.workout_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- WORKOUT_LOGS TABLE POLICIES
-- Users can CRUD their own workout logs
-- ============================================

-- Allow users to view their own workout logs
CREATE POLICY "Users can view own workout logs"
    ON public.workout_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own workout logs
CREATE POLICY "Users can insert own workout logs"
    ON public.workout_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own workout logs
CREATE POLICY "Users can update own workout logs"
    ON public.workout_logs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own workout logs
CREATE POLICY "Users can delete own workout logs"
    ON public.workout_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- NUTRITION_LOGS TABLE POLICIES
-- Users can CRUD their own nutrition logs
-- ============================================

-- Allow users to view their own nutrition logs
CREATE POLICY "Users can view own nutrition logs"
    ON public.nutrition_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own nutrition logs
CREATE POLICY "Users can insert own nutrition logs"
    ON public.nutrition_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own nutrition logs
CREATE POLICY "Users can update own nutrition logs"
    ON public.nutrition_logs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own nutrition logs
CREATE POLICY "Users can delete own nutrition logs"
    ON public.nutrition_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- USER_PROGRESS TABLE POLICIES
-- Users can CRUD their own progress records
-- ============================================

-- Allow users to view their own progress
CREATE POLICY "Users can view own progress"
    ON public.user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own progress
CREATE POLICY "Users can insert own progress"
    ON public.user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own progress
CREATE POLICY "Users can update own progress"
    ON public.user_progress
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own progress
CREATE POLICY "Users can delete own progress"
    ON public.user_progress
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- USER_GOALS TABLE POLICIES
-- Users can CRUD their own goals
-- ============================================

-- Allow users to view their own goals
CREATE POLICY "Users can view own goals"
    ON public.user_goals
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own goals
CREATE POLICY "Users can insert own goals"
    ON public.user_goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own goals
CREATE POLICY "Users can update own goals"
    ON public.user_goals
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own goals
CREATE POLICY "Users can delete own goals"
    ON public.user_goals
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Row Level Security policies created successfully!';
    RAISE NOTICE '🔒 Your database is now secured with RLS for 7 tables';
    RAISE NOTICE '📋 Optional: Run seed_exercises.sql to populate exercise database';
END $$;
