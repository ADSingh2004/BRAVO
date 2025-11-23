# 🚀 Supabase Database Setup Guide

## Overview
This guide will walk you through setting up the complete database for the S.H.AD2 Fitness Application using Supabase SQL Editor.

## Prerequisites
- ✅ Supabase Project URL: `https://khsnmgqsanwtppuwgplm.supabase.co`
- ✅ Supabase Anon Key: Already configured in `.env` file
- ✅ Supabase Account Access

---

## 📋 Setup Steps

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: **khsnmgqsanwtppuwgplm**

### Step 2: Open SQL Editor

1. In the left sidebar, click on **SQL Editor** icon (looks like `</>`)
2. Click **"New query"** button to create a new SQL query

### Step 3: Create Database Tables

1. Open the file: `database/01_create_tables.sql`
2. Copy the **entire contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button (or press `Ctrl/Cmd + Enter`)
5. Wait for execution to complete

**Expected Output:**
```
✅ All 7 tables created successfully!
📋 Tables: user_profiles, exercises, workout_entries, workout_logs, nutrition_logs, user_progress, user_goals
📋 Next step: Run 02_rls_policies.sql to enable Row Level Security
```

**What this does:**
- Creates 7 tables: user_profiles, exercises, workout_entries, workout_logs, nutrition_logs, user_progress, user_goals
- Sets up foreign key relationships
- Creates indexes for optimal performance
- Adds triggers for automatic timestamp updates
- Creates a function to auto-create user profiles on signup

### Step 4: Enable Row Level Security (RLS)

1. Click **"New query"** to create another query
2. Open the file: `database/02_rls_policies.sql`
3. Copy the **entire contents** of the file
4. Paste it into the Supabase SQL Editor
5. Click **"Run"** button

**Expected Output:**
```
✅ Row Level Security policies created successfully!
🔒 Your database is now secured with RLS for 7 tables
📋 Optional: Run seed_exercises.sql to populate exercise database
```

**What this does:**
- Enables Row Level Security on all 7 tables
- Creates policies ensuring users can only access their own data
- Protects user privacy and data integrity

### Step 5: Seed Exercise Database (Optional but Recommended)

1. Click **"New query"** to create another query
2. Open the file: `database/seed_exercises.sql`
3. Copy the **entire contents** of the file
4. Paste it into the Supabase SQL Editor
5. Click **"Run"** button

**Expected Output:**
```
✅ Exercise database seeded successfully!
💪 Added exercises for: Chest, Back, Legs, Shoulders, Arms, Core, and Cardio
📱 Your app is now ready to use!
```

**What this does:**
- Populates the exercises table with 25+ common exercises
- Covers all major muscle groups
- Includes detailed instructions for each exercise
- Provides exercises for different difficulty levels

---

## 🔍 Verify Installation

### Check Tables

Run this query in SQL Editor to verify all tables are created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables:**
- exercises
- nutrition_logs
- user_goals
- user_profiles
- user_progress
- workout_entries
- workout_logs

### Check RLS Status

Run this query to verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

### Check Exercise Count

Run this query to see how many exercises were seeded:

```sql
SELECT COUNT(*) as exercise_count FROM public.exercises;
```

Should return around 25+ exercises.

---

## 🔐 Authentication Setup

### Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if needed (optional)

### Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Set **Site URL**: Your app's URL (e.g., `http://localhost:5173` for development)
3. Add **Redirect URLs** if needed

---

## 📊 Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| **user_profiles** | User profile information (extends auth.users) |
| **exercises** | Master list of available exercises |
| **workout_entries** | Individual workout exercise entries |
| **workout_logs** | Summary of complete workout sessions |
| **nutrition_logs** | Daily nutrition tracking |
| **user_progress** | Body measurements and progress tracking over time |
| **user_goals** | User fitness goals and progress |

### Relationships

```
auth.users (Supabase Auth)
  └─> user_profiles
       ├─> workout_entries → exercises
       ├─> workout_logs
       ├─> nutrition_logs
       ├─> user_progress
       └─> user_goals

exercises (master data)
  └─> workout_entries
```

---

## 🧪 Test the Setup

### Create a Test User

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter email and password
4. Click **"Create user"**

### Verify Profile Creation

Run this query to check if the profile was auto-created:

```sql
SELECT * FROM public.user_profiles;
```

You should see the new user's profile.

### Test a Simple Insert

Try inserting a test workout entry:

```sql
INSERT INTO public.workout_entries (user_id, exercise_id, sets, reps, weight_kg)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  (SELECT id FROM public.exercises LIMIT 1),
  3,
  10,
  50.0
);
```

Then verify it was created:

```sql
SELECT * FROM public.workout_entries;
```

---

## 🛠️ Troubleshooting

### Error: "relation does not exist"

**Solution:** Run `01_create_tables.sql` first before running RLS policies.

### Error: "permission denied"

**Solution:** Make sure you're signed in to Supabase and have admin access to the project.

### Error: "duplicate key value violates unique constraint"

**Solution:** This is normal if you're re-running the seed file. The data is already there.

### RLS Blocking Queries

If you're testing in SQL Editor and policies are blocking you:

```sql
-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable when done
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
```

---

## 🔄 Resetting the Database

If you need to start fresh:

```sql
-- ⚠️ WARNING: This will delete ALL data!

DROP TABLE IF EXISTS public.workout_entries CASCADE;
DROP TABLE IF EXISTS public.workout_logs CASCADE;
DROP TABLE IF EXISTS public.nutrition_logs CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_goals CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Then re-run all setup scripts
```

---

## 📱 Next Steps

After completing the database setup:

1. ✅ Verify `.env` file has correct credentials
2. ✅ Restart your Vite dev server: `npm run dev`
3. ✅ Test authentication in your app
4. ✅ Start building features!

---

## 🔗 Useful Supabase Links

- **Dashboard**: https://supabase.com/dashboard
- **Documentation**: https://supabase.com/docs
- **SQL Editor**: `Your Project → SQL Editor`
- **Auth Users**: `Your Project → Authentication → Users`
- **Table Editor**: `Your Project → Table Editor`

---

## 📞 Support

If you encounter issues:

1. Check the Supabase logs: **Logs & Reports** in dashboard
2. Review the SQL execution output for errors
3. Verify your environment variables in `.env`
4. Check the database schema documentation in `SCHEMA.md`

---

## ✅ Checklist

- [ ] Ran `01_create_tables.sql` successfully
- [ ] Ran `02_rls_policies.sql` successfully
- [ ] Ran `seed_exercises.sql` successfully (optional)
- [ ] Verified all tables are created
- [ ] Verified RLS is enabled on all tables
- [ ] Created a test user
- [ ] Verified profile auto-creation works
- [ ] Tested a sample insert
- [ ] Environment variables are configured
- [ ] Dev server is running

**Congratulations! Your database is ready! 🎉**
