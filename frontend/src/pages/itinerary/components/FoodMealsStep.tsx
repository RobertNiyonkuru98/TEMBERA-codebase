import { UtensilsCrossed } from "lucide-react";
import type { StepProps } from "./types";

const MEAL_OPTIONS = ["breakfast", "lunch", "dinner", "snacks", "drinks"];

export function FoodMealsStep({ formData, updateFormData }: StepProps) {
  const toggleMealType = (meal: string) => {
    const current = formData.mealTypes || [];
    if (current.includes(meal)) {
      updateFormData({ mealTypes: current.filter((m) => m !== meal) });
    } else {
      updateFormData({ mealTypes: [...current, meal] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-amber-600 shadow-lg">
          <UtensilsCrossed className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Food & Meals
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Meal arrangements and dietary information
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Meals Included Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.mealsIncluded}
              onChange={(e) => updateFormData({ mealsIncluded: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Meals Included in Price
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Food and beverages are provided
              </span>
            </div>
          </label>
        </div>

        {/* Meal Types */}
        {formData.mealsIncluded && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Which Meals Are Included?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MEAL_OPTIONS.map((meal) => (
                <button
                  key={meal}
                  type="button"
                  onClick={() => toggleMealType(meal)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all capitalize ${
                    formData.mealTypes.includes(meal)
                      ? "bg-amber-600 text-white border-2 border-amber-600"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400"
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Food Options */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Food Options Available
          </label>
          <input
            type="text"
            value={formData.foodOptions}
            onChange={(e) => updateFormData({ foodOptions: e.target.value })}
            placeholder="e.g., Vegetarian, Vegan, Halal, Gluten-free options available"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-colors"
          />
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.canBuyFoodOnsite}
              onChange={(e) => updateFormData({ canBuyFoodOnsite: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Food Can Be Purchased On-Site
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Restaurants or vendors available at the location
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.canBringOwnFood}
              onChange={(e) => updateFormData({ canBringOwnFood: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-2 focus:ring-amber-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Participants Can Bring Own Food
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Packed meals and snacks are allowed
              </span>
            </div>
          </label>
        </div>

        {/* Dietary Accommodations */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Dietary Accommodations
          </label>
          <textarea
            value={formData.dietaryAccommodations}
            onChange={(e) => updateFormData({ dietaryAccommodations: e.target.value })}
            placeholder="Describe how you accommodate special dietary requirements (allergies, religious restrictions, etc.)..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
