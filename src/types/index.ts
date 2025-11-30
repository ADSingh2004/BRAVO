// App-wide TypeScript interfaces for BRAVO Fitness App

export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  verified?: boolean;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface WorkoutPlan {
  name: string;
  duration: string;
  exercises: Exercise[];
}

export interface NutritionPlan {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: string[];
}

export interface Plan {
  workout: WorkoutPlan;
  nutrition: NutritionPlan;
}

export interface Profile {
  name: string;
  goal: string;
  level: string;
  days: number;
  minutes: number;
}

export interface UserContext {
  goal?: string;
  fitnessLevel?: string;
  age?: number;
  weight?: number;
  height?: number;
  name?: string;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  sources?: Array<{
    type: string;
    name: string;
    details: string;
  }>;
  verified?: boolean;
  error?: string;
}
