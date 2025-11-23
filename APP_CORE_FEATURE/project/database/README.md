# Database Directory

This directory contains all database-related files for the S.H.AD2 Fitness Application.

## 📁 Files

### Schema Documentation
- **`SCHEMA.md`** - Complete database schema documentation with table descriptions, columns, and relationships

### SQL Scripts
- **`01_create_tables.sql`** - Creates all database tables, indexes, triggers, and functions
- **`02_rls_policies.sql`** - Enables Row Level Security and creates security policies
- **`seed_exercises.sql`** - (Optional) Seeds the database with 25+ pre-configured exercises

### Setup Guide
- **`SETUP_GUIDE.md`** - Step-by-step instructions for running SQL scripts in Supabase SQL Editor

## 🚀 Quick Start

1. Read `SETUP_GUIDE.md` for detailed instructions
2. Run scripts in order:
   1. `01_create_tables.sql`
   2. `02_rls_policies.sql`
   3. `seed_exercises.sql` (optional)

## 📊 Database Overview

The database includes 10 tables:
- **profiles** - User profiles
- **exercises** - Exercise library
- **workout_plans** - Workout plans
- **workout_sessions** - Individual workout sessions
- **session_exercises** - Exercises in sessions
- **completed_workouts** - Workout history
- **exercise_logs** - Detailed exercise logs
- **nutrition_logs** - Nutrition tracking
- **body_measurements** - Body measurements over time
- **goals** - Fitness goals

## 🔐 Security

All tables have Row Level Security (RLS) enabled to ensure:
- Users can only access their own data
- Public workout plans can be viewed by all users
- Exercise library is accessible to authenticated users

## 🔗 Connection

Database connection is configured in:
- `../src/lib/supabase.ts` - Supabase client
- `../.env` - Environment variables (Supabase URL and API key)

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
