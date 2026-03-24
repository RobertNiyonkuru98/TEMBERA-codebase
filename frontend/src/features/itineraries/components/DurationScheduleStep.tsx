import { Clock, Calendar } from "lucide-react";
import type { StepProps } from "./types";

export function DurationScheduleStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg">
          <Clock className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Duration & Schedule
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Time details and scheduling information
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Multi-day toggle */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isMultiDay}
              onChange={(e) => updateFormData({ isMultiDay: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              This is a multi-day itinerary
            </span>
          </label>
        </div>

        {/* Duration Days */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Duration (Days)
          </label>
          <input
            type="number"
            min="0"
            value={formData.durationDays}
            onChange={(e) => updateFormData({ durationDays: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Duration Hours */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Duration (Hours)
          </label>
          <input
            type="number"
            min="0"
            max="23"
            value={formData.durationHours}
            onChange={(e) => updateFormData({ durationHours: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => updateFormData({ startTime: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            End Time
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => updateFormData({ endTime: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Schedule Details */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Detailed Schedule
          </label>
          <textarea
            value={formData.scheduleDetails}
            onChange={(e) => updateFormData({ scheduleDetails: e.target.value })}
            placeholder="Provide a day-by-day or hour-by-hour breakdown of activities...&#10;&#10;Day 1: 08:00 - Departure from Kigali&#10;       10:00 - Arrival at Akagera&#10;       10:30 - Morning game drive&#10;       ..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}
