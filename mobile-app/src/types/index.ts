export interface OnboardingData {
  fullName: string;
  email: string;
  age: string;
  gender: string;
  currentWeight: string;
  height: string;
  targetWeight: string;
  primaryGoal: 'lose-weight' | 'build-muscle' | 'stay-active' | '';
  workoutLocation: 'home' | 'gym' | 'outdoor' | '';
  dietPreference: string;
  injuries: string;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface WorkoutPlan {
  name: string;
  duration: string;
  level?: string;
  exercises: Exercise[];
}

export interface NutritionPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: string[];
}

export interface Plan {
  workout: WorkoutPlan;
  nutrition: NutritionPlan;
}

export interface ChatMessage {
  type: 'user' | 'bot';
  text: string;
  verified?: boolean;
}

export interface Profile {
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  goal: string;
  level: string;
  days: number;
  minutes: number;
}
