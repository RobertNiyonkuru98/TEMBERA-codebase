import { MapPin, Navigation } from "lucide-react";
import type { StepProps } from "./types";

export function LocationDetailsStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-rose-600 shadow-lg">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Location Details
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Meeting points and GPS coordinates
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Meeting Point */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <Navigation className="inline h-4 w-4 mr-1" />
            Meeting Point
          </label>
          <input
            type="text"
            value={formData.meetingPoint}
            onChange={(e) => updateFormData({ meetingPoint: e.target.value })}
            placeholder="e.g., Kigali Convention Centre Main Entrance"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-colors"
          />
        </div>

        {/* Meeting Point GPS */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Meeting Point Latitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.meetingPointLat || ""}
              onChange={(e) => updateFormData({ meetingPointLat: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="-1.9403"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Meeting Point Longitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.meetingPointLng || ""}
              onChange={(e) => updateFormData({ meetingPointLng: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="30.0619"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-colors"
            />
          </div>
        </div>

        {/* End Point */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            End Point (if different)
          </label>
          <input
            type="text"
            value={formData.endPoint}
            onChange={(e) => updateFormData({ endPoint: e.target.value })}
            placeholder="e.g., Akagera National Park Gate"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-colors"
          />
        </div>

        {/* End Point GPS */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              End Point Latitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.endPointLat || ""}
              onChange={(e) => updateFormData({ endPointLat: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="-1.6163"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              End Point Longitude
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.endPointLng || ""}
              onChange={(e) => updateFormData({ endPointLng: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="30.7389"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-colors"
            />
          </div>
        </div>

        {/* Location Details */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Additional Location Details
          </label>
          <textarea
            value={formData.locationDetails}
            onChange={(e) => updateFormData({ locationDetails: e.target.value })}
            placeholder="Provide detailed directions, landmarks, parking information, or any other location-specific details..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
