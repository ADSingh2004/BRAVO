import { Apple, CheckCircle } from 'lucide-react';
import { NutritionPlan } from '../types';

interface NutritionCardProps {
  plan: NutritionPlan;
}

export default function NutritionCard({ plan }: NutritionCardProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
      {/* Header */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
        <Apple className="text-red-500" size={20} />
        Nutrition Plan
      </h3>
      
      {/* Daily Target */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm mb-2">
          <span className="text-gray-600">Daily Target</span>
          <span className="font-bold text-gray-800">{plan.calories} cal</span>
        </div>
      </div>

      {/* Macros */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">🥩 Protein</span>
          <span className="font-bold text-sm sm:text-base">{plan.protein}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">🍞 Carbs</span>
          <span className="font-bold text-sm sm:text-base">{plan.carbs}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">🥑 Fats</span>
          <span className="font-bold text-sm sm:text-base">{plan.fats}g</span>
        </div>
      </div>

      {/* Meals */}
      <div className="border-t border-gray-100 pt-3 sm:pt-4">
        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Meal Suggestions</p>
        <div className="space-y-1.5 sm:space-y-2">
          {plan.meals.map((meal: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span>{meal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
