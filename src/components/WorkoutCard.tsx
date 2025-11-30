import { Play, Dumbbell } from 'lucide-react';
import { WorkoutPlan, Exercise } from '../types';

interface WorkoutCardProps {
  plan: WorkoutPlan;
  onStartWorkout: () => void;
}

export default function WorkoutCard({ plan, onStartWorkout }: WorkoutCardProps) {
  return (
    <div className="bg-gradient-to-br from-teal-500 to-emerald-400 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{plan.name}</h3>
          <p className="text-teal-50 text-sm sm:text-base">Duration: {plan.duration}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 ml-3 flex-shrink-0">
          <Dumbbell className="text-white mb-1 sm:mb-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          <p className="text-xs sm:text-sm text-teal-50">Your Plan</p>
        </div>
      </div>
      
      {/* Exercise List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Today's Exercises</h4>
        <div className="space-y-2 sm:space-y-3">
          {plan.exercises.map((ex: Exercise, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                  {i + 1}
                </div>
                <span className="text-sm sm:text-base">{ex.name}</span>
              </div>
              <span className="text-teal-100 text-xs sm:text-sm">{ex.sets} × {ex.reps}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button 
        onClick={onStartWorkout}
        className="w-full bg-white text-teal-600 font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-50 transition-colors text-sm sm:text-base"
      >
        <Play size={18} fill="currentColor" />
        Start Workout
      </button>
    </div>
  );
}
