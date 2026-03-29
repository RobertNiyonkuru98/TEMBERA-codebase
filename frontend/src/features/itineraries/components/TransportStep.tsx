import { Bus, MapPin, Plus, X } from "lucide-react";
import { useState } from "react";
import type { StepProps } from "./types";

export function TransportStep({ formData, updateFormData }: StepProps) {
  const [newPickup, setNewPickup] = useState("");
  const [newDropoff, setNewDropoff] = useState("");

  const addLocation = (type: "pickupLocations" | "dropoffLocations", value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      updateFormData({ [type]: [...formData[type], value.trim()] });
      setter("");
    }
  };

  const removeLocation = (type: "pickupLocations" | "dropoffLocations", index: number) => {
    updateFormData({ [type]: formData[type].filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 shadow-lg">
          <Bus className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Transportation
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Transport arrangements and logistics
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Transport Included */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.transportIncluded}
              onChange={(e) => updateFormData({ transportIncluded: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Transportation Included
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                We provide transport for participants
              </span>
            </div>
          </label>
        </div>

        {formData.transportIncluded && (
          <>
            {/* Transport Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Type of Transport
              </label>
              <input
                type="text"
                value={formData.transportType}
                onChange={(e) => updateFormData({ transportType: e.target.value })}
                placeholder="e.g., Air-conditioned bus, 4x4 safari vehicle, boat"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
              />
            </div>

            {/* Pickup Locations */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
                <MapPin className="inline h-4 w-4 mr-1" />
                Pickup Locations
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPickup}
                  onChange={(e) => setNewPickup(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLocation("pickupLocations", newPickup, setNewPickup))}
                  placeholder="Add pickup location"
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => addLocation("pickupLocations", newPickup, setNewPickup)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.pickupLocations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                    <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="flex-1 text-sm text-slate-900 dark:text-slate-50">{location}</span>
                    <button
                      type="button"
                      onClick={() => removeLocation("pickupLocations", index)}
                      className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dropoff Locations */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
                <MapPin className="inline h-4 w-4 mr-1" />
                Dropoff Locations
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDropoff}
                  onChange={(e) => setNewDropoff(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLocation("dropoffLocations", newDropoff, setNewDropoff))}
                  placeholder="Add dropoff location"
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => addLocation("dropoffLocations", newDropoff, setNewDropoff)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.dropoffLocations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                    <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="flex-1 text-sm text-slate-900 dark:text-slate-50">{location}</span>
                    <button
                      type="button"
                      onClick={() => removeLocation("dropoffLocations", index)}
                      className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.allowsOwnTransport}
              onChange={(e) => updateFormData({ allowsOwnTransport: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Participants Can Use Own Transport
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Allow participants to drive themselves
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.parkingAvailable}
              onChange={(e) => updateFormData({ parkingAvailable: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Parking Available
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Parking facilities at the location
              </span>
            </div>
          </label>
        </div>

        {/* Transport Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Additional Transport Notes
          </label>
          <textarea
            value={formData.transportNotes}
            onChange={(e) => updateFormData({ transportNotes: e.target.value })}
            placeholder="Any additional information about transportation, directions, parking fees, etc..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
