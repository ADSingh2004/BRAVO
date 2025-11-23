-- ============================================
-- CLEANUP SCRIPT - Drop Existing Tables
-- ============================================
-- Run this FIRST to remove any blank/incomplete tables
-- Then run 01_create_tables.sql again
-- ============================================

-- Drop triggers FIRST (before dropping functions they depend on)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles CASCADE;
DROP TRIGGER IF EXISTS update_user_goals_updated_at ON public.user_goals CASCADE;

-- Drop functions (before dropping tables)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop all tables in reverse order (to handle foreign key dependencies)
DROP TABLE IF EXISTS public.workout_entries CASCADE;
DROP TABLE IF EXISTS public.workout_logs CASCADE;
DROP TABLE IF EXISTS public.nutrition_logs CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_goals CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ All tables, triggers, and functions dropped successfully!';
    RAISE NOTICE '📋 Next step: Run 01_create_tables.sql to create the tables with proper structure';
END $$;
