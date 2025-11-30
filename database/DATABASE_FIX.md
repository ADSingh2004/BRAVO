# BRAVO Database Fix Guide

## Issue: Onboarding Appearing Repeatedly

If the onboarding form appears every time a user logs in instead of only once, follow these steps to fix the database.

---

## Step 1: Add the `onboarding_completed` Column

Run this SQL in your **Supabase SQL Editor**:

```sql
-- Add onboarding_completed column if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding 
ON public.user_profiles(onboarding_completed);
```

---

## Step 2: Mark Existing Users as Onboarded

If you have users who already completed the old onboarding flow (they have profile data), run this to mark them as completed:

```sql
-- Update existing users with complete profile data
UPDATE public.user_profiles 
SET onboarding_completed = TRUE 
WHERE full_name IS NOT NULL 
  AND height_cm IS NOT NULL 
  AND weight_kg IS NOT NULL;
```

---

## Step 3: Verify the Fix

Check if the column was added and users are marked correctly:

```sql
-- Check column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name = 'onboarding_completed';

-- Check user onboarding status
SELECT id, full_name, onboarding_completed 
FROM public.user_profiles 
LIMIT 10;
```

---

## Step 4: Fix Specific User (Optional)

If a specific user keeps seeing the onboarding form, manually mark them as completed:

```sql
-- Replace 'USER_ID_HERE' with the actual user ID
UPDATE public.user_profiles 
SET onboarding_completed = TRUE 
WHERE id = 'USER_ID_HERE';
```

To find a user's ID by email:
```sql
SELECT u.id, u.email, p.full_name, p.onboarding_completed
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE u.email = 'user@example.com';
```

---

## How the Onboarding Flow Works

1. **New User**: 
   - User signs up → Sees onboarding form
   - Fills form → Data saved to `user_profiles` with `onboarding_completed = TRUE`
   - Next login → Skips to dashboard

2. **Returning User**:
   - User logs in → App checks `user_profiles` for their `id`
   - If `onboarding_completed = TRUE` OR has (`full_name` + `height_cm` + `weight_kg`) → Go to dashboard
   - If no profile or incomplete → Show onboarding

3. **Backwards Compatibility**:
   - Users who completed the old flow (before `onboarding_completed` existed) are detected by checking if they have basic profile data (`full_name`, `height_cm`, `weight_kg`)

---

## Troubleshooting

### Problem: Onboarding still appears for existing users
**Solution**: Run Step 2 to mark all users with complete profiles as onboarded.

### Problem: Column already exists error
**Solution**: This is fine - the `IF NOT EXISTS` clause handles this. The column is already there.

### Problem: User has no profile row at all
**Solution**: The user needs to complete onboarding once. If they completed it before but have no row, you may need to manually insert one:

```sql
INSERT INTO public.user_profiles (id, full_name, onboarding_completed)
VALUES ('USER_ID_HERE', 'User Name', TRUE)
ON CONFLICT (id) DO UPDATE SET onboarding_completed = TRUE;
```

---

## Full SQL Script

Run this complete script to fix everything at once:

```sql
-- ============================================
-- BRAVO Database Fix - Onboarding Column
-- ============================================

-- 1. Add column if missing
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 2. Create index
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding 
ON public.user_profiles(onboarding_completed);

-- 3. Mark existing complete profiles as onboarded
UPDATE public.user_profiles 
SET onboarding_completed = TRUE 
WHERE full_name IS NOT NULL 
  AND height_cm IS NOT NULL 
  AND weight_kg IS NOT NULL
  AND (onboarding_completed IS NULL OR onboarding_completed = FALSE);

-- 4. Verify
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE onboarding_completed = TRUE) as onboarded_users,
  COUNT(*) FILTER (WHERE onboarding_completed = FALSE OR onboarding_completed IS NULL) as pending_onboarding
FROM public.user_profiles;
```

---

## Expected Behavior After Fix

| User State | What Happens |
|------------|--------------|
| New user, never logged in | Sees onboarding form |
| New user, completed onboarding | Goes directly to dashboard |
| Existing user with profile data | Goes directly to dashboard |
| Existing user, no profile | Sees onboarding form (one time) |
