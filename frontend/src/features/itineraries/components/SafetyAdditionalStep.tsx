import { Shield, Globe, Cloud, Plus, X } from "lucide-react";
import { useState } from "react";
import type { StepProps } from "./types";

export function SafetyAdditionalStep({ formData, updateFormData }: StepProps) {
  const [newSafetyMeasure, setNewSafetyMeasure] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const addItem = (type: "safetyMeasures" | "languagesOffered", value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      updateFormData({ [type]: [...formData[type], value.trim()] });
      setter("");
    }
  };

  const removeItem = (type: "safetyMeasures" | "languagesOffered", index: number) => {
    updateFormData({ [type]: formData[type].filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-cyan-600 shadow-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Safety & Additional Info
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Safety measures, insurance, and other details
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Insurance Included */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.insuranceIncluded}
              onChange={(e) => updateFormData({ insuranceIncluded: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                Insurance Included
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Travel or activity insurance is provided
              </span>
            </div>
          </label>
        </div>

        {/* Insurance Details */}
        {formData.insuranceIncluded && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Insurance Details
            </label>
            <textarea
              value={formData.insuranceDetails}
              onChange={(e) => updateFormData({ insuranceDetails: e.target.value })}
              placeholder="Describe the insurance coverage (medical, accident, cancellation, etc.)..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
            />
          </div>
        )}

        {/* Safety Measures */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            <Shield className="inline h-4 w-4 mr-1" />
            Safety Measures
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSafetyMeasure}
              onChange={(e) => setNewSafetyMeasure(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("safetyMeasures", newSafetyMeasure, setNewSafetyMeasure))}
              placeholder="e.g., First aid kit on board"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => addItem("safetyMeasures", newSafetyMeasure, setNewSafetyMeasure)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.safetyMeasures.map((measure, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                <Shield className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="flex-1 text-sm text-slate-900 dark:text-slate-50">{measure}</span>
                <button
                  type="button"
                  onClick={() => removeItem("safetyMeasures", index)}
                  className="p-1 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Procedures */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Emergency Procedures
          </label>
          <textarea
            value={formData.emergencyProcedures}
            onChange={(e) => updateFormData({ emergencyProcedures: e.target.value })}
            placeholder="Describe emergency procedures and contact information..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
          />
        </div>

        {/* Medical Requirements */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Medical Requirements
          </label>
          <textarea
            value={formData.medicalRequirements}
            onChange={(e) => updateFormData({ medicalRequirements: e.target.value })}
            placeholder="Any medical requirements, vaccinations, or health conditions to consider..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
          />
        </div>

        {/* Languages Offered */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            <Globe className="inline h-4 w-4 mr-1" />
            Languages Offered
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("languagesOffered", newLanguage, setNewLanguage))}
              placeholder="e.g., English, French, Kinyarwanda"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => addItem("languagesOffered", newLanguage, setNewLanguage)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.languagesOffered.map((lang, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                <span className="text-sm text-slate-900 dark:text-slate-50">{lang}</span>
                <button
                  type="button"
                  onClick={() => removeItem("languagesOffered", index)}
                  className="hover:bg-cyan-100 dark:hover:bg-cyan-900/40 rounded transition-colors"
                >
                  <X className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Guide Info */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Guide Information
          </label>
          <textarea
            value={formData.guideInfo}
            onChange={(e) => updateFormData({ guideInfo: e.target.value })}
            placeholder="Information about guides (qualifications, experience, certifications)..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
          />
        </div>

        {/* Weather Dependency */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.weatherDependency}
              onChange={(e) => updateFormData({ weatherDependency: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
            />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                <Cloud className="inline h-4 w-4 mr-1" />
                Weather Dependent
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                This activity may be affected by weather conditions
              </span>
            </div>
          </label>
        </div>

        {/* Weather Notes */}
        {formData.weatherDependency && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Weather Notes
            </label>
            <textarea
              value={formData.weatherNotes}
              onChange={(e) => updateFormData({ weatherNotes: e.target.value })}
              placeholder="Explain how weather affects the activity and your contingency plans..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
            />
          </div>
        )}

        {/* What to Wear */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            What to Wear
          </label>
          <textarea
            value={formData.whatToWear}
            onChange={(e) => updateFormData({ whatToWear: e.target.value })}
            placeholder="Recommended clothing and footwear..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => updateFormData({ additionalNotes: e.target.value })}
            placeholder="Any other important information participants should know..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
          />
        </div>

        {/* Terms and Conditions */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Terms & Conditions
          </label>
          <textarea
            value={formData.termsAndConditions}
            onChange={(e) => updateFormData({ termsAndConditions: e.target.value })}
            placeholder="Terms and conditions for participation..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
}
