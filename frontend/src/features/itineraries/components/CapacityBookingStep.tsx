import { Users, Percent, Calendar } from "lucide-react";
import type { StepProps } from "./types";

export function CapacityBookingStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Capacity & Booking
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Participant limits and booking policies
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Min Participants */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Minimum Participants
          </label>
          <input
            type="number"
            min="1"
            value={formData.minParticipants}
            onChange={(e) => updateFormData({ minParticipants: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          />
        </div>

        {/* Max Participants */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Maximum Participants
          </label>
          <input
            type="number"
            min="1"
            value={formData.maxParticipants}
            onChange={(e) => updateFormData({ maxParticipants: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          />
        </div>

        {/* Available Slots */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Available Slots
          </label>
          <input
            type="number"
            min="0"
            value={formData.availableSlots}
            onChange={(e) => updateFormData({ availableSlots: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          />
        </div>

        {/* Booking Deadline */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Booking Deadline
          </label>
          <input
            type="date"
            value={formData.bookingDeadline}
            onChange={(e) => updateFormData({ bookingDeadline: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          />
        </div>

        {/* Booking Options */}
        <div className="md:col-span-2 space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            Booking Options
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.allowsIndividuals}
              onChange={(e) => updateFormData({ allowsIndividuals: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Allow Individual Bookings
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Single participants can book this itinerary
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.allowsGroups}
              onChange={(e) => updateFormData({ allowsGroups: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Allow Group Bookings
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Groups can book this itinerary together
              </span>
            </div>
          </label>
        </div>

        {/* Group Discount */}
        {formData.allowsGroups && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                <Percent className="inline h-4 w-4 mr-1" />
                Group Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.groupDiscountPercent}
                onChange={(e) => updateFormData({ groupDiscountPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Minimum Group Size for Discount
              </label>
              <input
                type="number"
                min="2"
                value={formData.groupMinSize}
                onChange={(e) => updateFormData({ groupMinSize: parseInt(e.target.value) || 2 })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
