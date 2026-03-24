import { Calendar, MapPin, FileText, Tag } from "lucide-react";
import type { StepProps } from "./types";

const CATEGORIES = [
  "Safari",
  "Hiking",
  "Cultural Tour",
  "Adventure",
  "Wildlife",
  "City Tour",
  "Beach & Water",
  "Mountain",
  "Historical",
  "Food & Culinary",
  "Photography",
  "Eco-Tourism",
  "Other",
];

const COMMON_TAGS = [
  "family-friendly",
  "adventure",
  "cultural",
  "nature",
  "wildlife",
  "photography",
  "romantic",
  "group-activity",
  "solo-friendly",
  "educational",
  "relaxing",
  "challenging",
];

export function BasicInfoStep({ formData, updateFormData }: StepProps) {
  const handleTagToggle = (tag: string) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      updateFormData({ tags: currentTags.filter((t) => t !== tag) });
    } else {
      updateFormData({ tags: [...currentTags, tag] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Basic Information
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Essential details about your itinerary
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Itinerary Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g., Akagera National Park Safari"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            required
          />
        </div>

        {/* Activity */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Activity Type
          </label>
          <input
            type="text"
            value={formData.activity}
            onChange={(e) => updateFormData({ activity: e.target.value })}
            placeholder="e.g., Game Drive, Hiking, Boat Cruise"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => updateFormData({ date: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="e.g., Akagera National Park, Eastern Province"
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Provide a detailed description of the itinerary, what participants will experience, and what makes it special..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {formData.description.length} / 3000 characters
          </p>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
            <Tag className="inline h-4 w-4 mr-1" />
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  formData.tags.includes(tag)
                    ? "bg-emerald-600 text-white border-2 border-emerald-600"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
