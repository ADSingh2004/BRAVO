# Database Schema Documentation

## Overview
This document describes the database schema for the S.H.AD2 Fitness Application. The schema is designed to support personalized workout tracking, nutrition management, and progress monitoring.

## Tables

### 1. **profiles**
Extends Supabase auth.users with additional user information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users(id) |
| username | text | Unique username |
| full_name | text | User's full name |
| avatar_url | text | Profile picture URL |
| bio | text | User biography |
| date_of_birth | date | Birth date |
| gender | text | Gender (male, female, other) |
| height_cm | numeric | Height in centimeters |
| weight_kg | numeric | Current weight in kilograms |
| fitness_goal | text | Primary fitness goal |
| created_at | timestamptz | Account creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### 2. **exercises**
Master list of exercises available in the system.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Exercise name |
| description | text | Detailed description |
| muscle_group | text | Primary muscle group targeted |
| equipment | text | Required equipment |
| difficulty | text | Difficulty level (beginner, intermediate, advanced) |
| instructions | text[] | Step-by-step instructions |
| video_url | text | Demonstration video URL |
| image_url | text | Exercise image URL |
| created_at | timestamptz | Creation timestamp |

### 3. **workout_plans**
User-created or system-generated workout plans.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles(id) |
| name | text | Workout plan name |
| description | text | Plan description |
| difficulty | text | Difficulty level |
| duration_weeks | integer | Plan duration in weeks |
| is_public | boolean | Whether plan is shareable |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### 4. **workout_sessions**
Individual workout sessions within a plan.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| workout_plan_id | uuid | Foreign key to workout_plans(id) |
| name | text | Session name (e.g., "Day 1: Chest & Triceps") |
| day_number | integer | Day number in the plan |
| notes | text | Session notes |
| created_at | timestamptz | Creation timestamp |

### 5. **session_exercises**
Exercises within a workout session.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| session_id | uuid | Foreign key to workout_sessions(id) |
| exercise_id | uuid | Foreign key to exercises(id) |
| order_index | integer | Exercise order in session |
| sets | integer | Number of sets |
| reps | integer | Number of reps per set |
| rest_seconds | integer | Rest time between sets |
| notes | text | Exercise-specific notes |

### 6. **completed_workouts**
Log of completed workouts by users.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles(id) |
| workout_session_id | uuid | Foreign key to workout_sessions(id) |
| completed_at | timestamptz | Completion timestamp |
| duration_minutes | integer | Workout duration |
| notes | text | Post-workout notes |
| rating | integer | User rating (1-5) |

### 7. **exercise_logs**
Detailed logs of individual exercises performed.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| completed_workout_id | uuid | Foreign key to completed_workouts(id) |
| exercise_id | uuid | Foreign key to exercises(id) |
| set_number | integer | Set number |
| reps_completed | integer | Actual reps completed |
| weight_kg | numeric | Weight used in kilograms |
| notes | text | Set-specific notes |

### 8. **nutrition_logs**
Daily nutrition tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles(id) |
| date | date | Log date |
| meal_type | text | Meal type (breakfast, lunch, dinner, snack) |
| food_name | text | Food item name |
| calories | numeric | Calorie count |
| protein_g | numeric | Protein in grams |
| carbs_g | numeric | Carbohydrates in grams |
| fat_g | numeric | Fat in grams |
| notes | text | Additional notes |
| created_at | timestamptz | Creation timestamp |

### 9. **body_measurements**
Track body measurements over time.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles(id) |
| measured_at | timestamptz | Measurement timestamp |
| weight_kg | numeric | Weight in kilograms |
| body_fat_percentage | numeric | Body fat percentage |
| chest_cm | numeric | Chest circumference |
| waist_cm | numeric | Waist circumference |
| hips_cm | numeric | Hip circumference |
| bicep_cm | numeric | Bicep circumference |
| thigh_cm | numeric | Thigh circumference |
| notes | text | Measurement notes |

### 10. **goals**
User fitness goals and tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to profiles(id) |
| goal_type | text | Goal type (weight_loss, muscle_gain, strength, etc.) |
| target_value | numeric | Target value |
| current_value | numeric | Current value |
| target_date | date | Target completion date |
| status | text | Goal status (active, completed, abandoned) |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

## Relationships

```
auth.users (Supabase Auth)
  └─> profiles (1:1)
       ├─> workout_plans (1:Many)
       ├─> completed_workouts (1:Many)
       ├─> nutrition_logs (1:Many)
       ├─> body_measurements (1:Many)
       └─> goals (1:Many)

exercises (Master Data)
  ├─> session_exercises (1:Many)
  └─> exercise_logs (1:Many)

workout_plans
  └─> workout_sessions (1:Many)
       └─> session_exercises (1:Many)

workout_sessions
  └─> completed_workouts (1:Many)

completed_workouts
  └─> exercise_logs (1:Many)
```

## Indexes

For optimal performance, indexes will be created on:
- Foreign key columns
- Frequently queried columns (user_id, date, completed_at)
- Unique constraints (username, email)

## Row Level Security (RLS)

All tables will have RLS enabled with policies ensuring:
- Users can only read/write their own data
- Public workout plans can be viewed by all authenticated users
- Exercise master data is readable by all authenticated users
