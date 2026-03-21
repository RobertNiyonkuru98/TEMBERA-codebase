import { Activity, Users, AlertCircle } from "lucide-react";
import type { StepProps } from "./types";

const DIFFICULTY_LEVELS = ["Easy", "Moderate", "Hard", "Expert"];
const FITNESS_LEVELS = ["None", "Basic", "Moderate", "High", "Very High"];

export function RequirementsStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Requirements & Restrictions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Difficulty level and participant requirements
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Difficulty Level
          </label>
          <select
            value={formData.difficultyLevel}
            onChange={(e) => updateFormData({ difficultyLevel: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors"
          >
            <option value="">Select difficulty</option>
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Fitness Level Required */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Fitness Level Required
          </label>
          <select
            value={formData.fitnessLevelRequired}
            onChange={(e) => updateFormData({ fitnessLevelRequired: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors"
          >
            <option value="">Select fitness level</option>
            {FITNESS_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Min Age */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <Users className="inline h-4 w-4 mr-1" />
            Minimum Age
          </label>
          <input
            type="number"
            min="0"
            value={formData.minAge}
            onChange={(e) => updateFormData({ minAge: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors"
          />
        </div>

        {/* Max Age */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Maximum Age
          </label>
          <input
            type="number"
            min="0"
            value={formData.maxAge}
            onChange={(e) => updateFormData({ maxAge: parseInt(e.target.value) || 100 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors"
          />
        </div>

        {/* Age Restrictions Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Age Restrictions Notes
          </label>
          <textarea
            value={formData.ageRestrictionsNotes}
            onChange={(e) => updateFormData({ ageRestrictionsNotes: e.target.value })}
            placeholder="e.g., Children under 12 must be accompanied by an adult, seniors welcome with medical clearance..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors resize-none"
          />
        </div>

        {/* Accessibility Info */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            Accessibility Information
          </label>
          <textarea
            value={formData.accessibilityInfo}
            onChange={(e) => updateFormData({ accessibilityInfo: e.target.value })}
            placeholder="Describe accessibility features (wheelchair access, hearing assistance, visual aids, etc.) or limitations..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
