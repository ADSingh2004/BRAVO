-- Quick Check and Add Settings Column
-- Run this in Supabase SQL Editor if you're getting "Failed to load settings" error

-- Step 1: Check if settings column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'settings'
    ) THEN
        -- Step 2: Add the settings column if it doesn't exist
        ALTER TABLE public.user_profiles 
        ADD COLUMN settings JSONB DEFAULT '{
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

        -- Step 3: Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_user_profiles_settings 
        ON public.user_profiles USING GIN (settings);

        RAISE NOTICE 'Settings column added successfully!';
    ELSE
        RAISE NOTICE 'Settings column already exists!';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles' 
AND column_name = 'settings';
