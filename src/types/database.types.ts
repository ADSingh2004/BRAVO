// Database Types for S.H.AD2 Fitness App
// TypeScript types for Supabase tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height_cm: number | null
          weight_kg: number | null
          fitness_level: 'beginner' | 'intermediate' | 'advanced' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height_cm?: number | null
          weight_kg?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height_cm?: number | null
          weight_kg?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string | null
          muscle_group: string
          equipment: string | null
          difficulty: 'beginner' | 'intermediate' | 'advanced' | null
          instructions: string[] | null
          video_url: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          muscle_group: string
          equipment?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          instructions?: string[] | null
          video_url?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          muscle_group?: string
          equipment?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | null
          instructions?: string[] | null
          video_url?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      workout_entries: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          workout_date: string
          sets: number
          reps: number
          weight_kg: number | null
          duration_minutes: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          workout_date?: string
          sets: number
          reps: number
          weight_kg?: number | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          workout_date?: string
          sets?: number
          reps?: number
          weight_kg?: number | null
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          workout_date: string
          total_duration_minutes: number | null
          total_calories_burned: number | null
          workout_type: string | null
          notes: string | null
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_date?: string
          total_duration_minutes?: number | null
          total_calories_burned?: number | null
          workout_type?: string | null
          notes?: string | null
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_date?: string
          total_duration_minutes?: number | null
          total_calories_burned?: number | null
          workout_type?: string | null
          notes?: string | null
          rating?: number | null
          created_at?: string
        }
      }
      nutrition_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          food_name: string
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fat_g: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          food_name: string
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          food_name?: string
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          recorded_at: string
          weight_kg: number | null
          body_fat_percentage: number | null
          muscle_mass_kg: number | null
          chest_cm: number | null
          waist_cm: number | null
          hips_cm: number | null
          bicep_cm: number | null
          thigh_cm: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          recorded_at?: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          muscle_mass_kg?: number | null
          chest_cm?: number | null
          waist_cm?: number | null
          hips_cm?: number | null
          bicep_cm?: number | null
          thigh_cm?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          recorded_at?: string
          weight_kg?: number | null
          body_fat_percentage?: number | null
          muscle_mass_kg?: number | null
          chest_cm?: number | null
          waist_cm?: number | null
          hips_cm?: number | null
          bicep_cm?: number | null
          thigh_cm?: number | null
          notes?: string | null
        }
      }
      user_goals: {
        Row: {
          id: string
          user_id: string
          goal_type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'custom'
          target_value: number
          current_value: number | null
          target_date: string | null
          status: 'active' | 'completed' | 'abandoned'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'custom'
          target_value: number
          current_value?: number | null
          target_date?: string | null
          status?: 'active' | 'completed' | 'abandoned'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'flexibility' | 'custom'
          target_value?: number
          current_value?: number | null
          target_date?: string | null
          status?: 'active' | 'completed' | 'abandoned'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
