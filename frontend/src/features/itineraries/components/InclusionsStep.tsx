import { CheckCircle2, XCircle, Package, Backpack, Plus, X } from "lucide-react";
import { useState } from "react";
import type { StepProps } from "./types";

export function InclusionsStep({ formData, updateFormData }: StepProps) {
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [newRequiredItem, setNewRequiredItem] = useState("");

  const addItem = (type: "inclusions" | "exclusions" | "providedEquipment" | "requiredItems", value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      updateFormData({ [type]: [...formData[type], value.trim()] });
      setter("");
    }
  };

  const removeItem = (type: "inclusions" | "exclusions" | "providedEquipment" | "requiredItems", index: number) => {
    updateFormData({ [type]: formData[type].filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-green-600 shadow-lg">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Inclusions & Equipment
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            What's included and what participants need to bring
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Inclusions */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            <CheckCircle2 className="inline h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
            What's Included
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("inclusions", newInclusion, setNewInclusion))}
              placeholder="e.g., Park entrance fees"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => addItem("inclusions", newInclusion, setNewInclusion)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.inclusions.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="flex-1 text-sm text-slate-900 dark:text-slate-50">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem("inclusions", index)}
                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/40 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            <XCircle className="inline h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
            What's NOT Included
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("exclusions", newExclusion, setNewExclusion))}
              placeholder="e.g., Personal expenses"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => addItem("exclusions", newExclusion, setNewExclusion)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.exclusions.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                <span className="flex-1 text-sm text-slate-900 dark:text-slate-50">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem("exclusions", index)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Provided Equipment */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            <Package className="inline h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
            Equipment We Provide
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("providedEquipment", newEquipment, setNewEquipment))}
              placeholder="e.g., Binoculars, Camera"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => addItem("providedEquipment", newEquipment, setNewEquipment)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.providedEquipment.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="flex-1 text-sm text-slate-900 dark:text-slate-50">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem("providedEquipment", index)}
                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Required Items */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            <Backpack className="inline h-4 w-4 mr-1 text-orange-600 dark:text-orange-400" />
            What to Bring
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newRequiredItem}
              onChange={(e) => setNewRequiredItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("requiredItems", newRequiredItem, setNewRequiredItem))}
              placeholder="e.g., Sunscreen, Hat"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => addItem("requiredItems", newRequiredItem, setNewRequiredItem)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.requiredItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <Backpack className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span className="flex-1 text-sm text-slate-900 dark:text-slate-50">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem("requiredItems", index)}
                  className="p-1 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
