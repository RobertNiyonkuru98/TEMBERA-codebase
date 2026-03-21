import { CheckCircle2, AlertCircle } from "lucide-react";
import type { StepProps } from "./types";

export function ReviewSubmitStep({ formData }: StepProps) {
  const missingRequired = [];
  if (!formData.title) missingRequired.push("Title");
  if (!formData.date) missingRequired.push("Date");
  if (formData.price <= 0) missingRequired.push("Price");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Review & Submit
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review your itinerary before publishing
          </p>
        </div>
      </div>

      {missingRequired.length > 0 && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Missing Required Fields
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Please fill in: {missingRequired.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info Summary */}
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Basic Information</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Title:</span>
              <span className="text-slate-900 dark:text-slate-50 font-medium">{formData.title || "Not set"}</span>
            </div>
            {formData.activity && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Activity:</span>
                <span className="text-slate-900 dark:text-slate-50">{formData.activity}</span>
              </div>
            )}
            {formData.category && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Category:</span>
                <span className="text-slate-900 dark:text-slate-50">{formData.category}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Date:</span>
              <span className="text-slate-900 dark:text-slate-50">{formData.date || "Not set"}</span>
            </div>
            {formData.location && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Location:</span>
                <span className="text-slate-900 dark:text-slate-50">{formData.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Duration Summary */}
        {(formData.durationDays > 0 || formData.durationHours > 0) && (
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Duration</h3>
            <div className="grid gap-3 text-sm">
              {formData.durationDays > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Days:</span>
                  <span className="text-slate-900 dark:text-slate-50">{formData.durationDays}</span>
                </div>
              )}
              {formData.durationHours > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Hours:</span>
                  <span className="text-slate-900 dark:text-slate-50">{formData.durationHours}</span>
                </div>
              )}
              {formData.startTime && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Start Time:</span>
                  <span className="text-slate-900 dark:text-slate-50">{formData.startTime}</span>
                </div>
              )}
              {formData.endTime && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">End Time:</span>
                  <span className="text-slate-900 dark:text-slate-50">{formData.endTime}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Capacity Summary */}
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Capacity & Booking</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Participants:</span>
              <span className="text-slate-900 dark:text-slate-50">{formData.minParticipants} - {formData.maxParticipants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Available Slots:</span>
              <span className="text-slate-900 dark:text-slate-50">{formData.availableSlots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Individuals:</span>
              <span className="text-slate-900 dark:text-slate-50">{formData.allowsIndividuals ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Groups:</span>
              <span className="text-slate-900 dark:text-slate-50">{formData.allowsGroups ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Pricing</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Base Price:</span>
              <span className="text-slate-900 dark:text-slate-50 font-semibold">{formData.price} {formData.currency}</span>
            </div>
            {formData.pricePerPerson > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Per Person:</span>
                <span className="text-slate-900 dark:text-slate-50">{formData.pricePerPerson} {formData.currency}</span>
              </div>
            )}
            {formData.pricePerGroup > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Per Group:</span>
                <span className="text-slate-900 dark:text-slate-50">{formData.pricePerGroup} {formData.currency}</span>
              </div>
            )}
          </div>
        </div>

        {/* Inclusions Summary */}
        {formData.inclusions.length > 0 && (
          <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Inclusions</h3>
            <ul className="space-y-2 text-sm">
              {formData.inclusions.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-900 dark:text-slate-50">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Media Summary */}
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Media</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Images:</span>
              <span className="text-slate-900 dark:text-slate-50">{formData.images.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Videos:</span>
              <span className="text-slate-900 dark:text-slate-50">{formData.videos.length}</span>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Status:</strong> Your itinerary will be saved as "{formData.status}" and {formData.isActive ? "will be" : "will not be"} visible to users.
          </p>
        </div>
      </div>
    </div>
  );
}
