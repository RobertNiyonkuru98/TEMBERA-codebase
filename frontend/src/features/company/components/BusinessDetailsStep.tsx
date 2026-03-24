import { FileText } from "lucide-react";
import { useI18n } from "@/core/i18n";
import { TOUR_SPECIALIZATIONS, LANGUAGES } from "@/shared/constants/companyOptions";
import type { StepProps } from "./types";

export function BusinessDetailsStep({ formData, updateFormData }: StepProps) {
  const { t } = useI18n();
  
  const toggleSpecialization = (value: string) => {
    const newSpecializations = formData.specializations.includes(value)
      ? formData.specializations.filter((s) => s !== value)
      : [...formData.specializations, value];
    updateFormData({ specializations: newSpecializations });
  };

  const toggleLanguage = (value: string) => {
    const newLanguages = formData.languages.includes(value)
      ? formData.languages.filter((l) => l !== value)
      : [...formData.languages, value];
    updateFormData({ languages: newLanguages });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("admin.createCompany.businessDetails")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("admin.createCompany.businessDetailsDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Specializations */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("admin.createCompany.specializations")}
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("admin.createCompany.specializationsHint")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {TOUR_SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.value}
                type="button"
                onClick={() => toggleSpecialization(spec.value)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                  formData.specializations.includes(spec.value)
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-600 dark:border-emerald-400 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:shadow"
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>
          {formData.specializations.length > 0 && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {formData.specializations.length} {t("admin.createCompany.specializationsSelected")}
            </p>
          )}
        </div>

        {/* Languages */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("admin.createCompany.languages")}
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("admin.createCompany.languagesHint")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => toggleLanguage(lang.value)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                  formData.languages.includes(lang.value)
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-600 dark:border-emerald-400 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:shadow"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          {formData.languages.length > 0 && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {formData.languages.length} {t("admin.createCompany.languagesSelected")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
