import { Clock, Globe } from "lucide-react";
import { useI18n } from "@/core/i18n";
import type { StepProps } from "./types";

export function OperationalOnlineStep({ formData, updateFormData }: StepProps) {
  const { t } = useI18n();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <Clock className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("admin.createCompany.operational")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("admin.createCompany.operationalDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("admin.createCompany.operatingHours")}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.operatingDays")}</span>
              <input
                value={formData.operatingDays}
                onChange={(e) => updateFormData({ operatingDays: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                placeholder={t("admin.createCompany.operatingDaysPlaceholder")}
                maxLength={100}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.operatingHoursLabel")}</span>
              <input
                value={formData.operatingHours}
                onChange={(e) => updateFormData({ operatingHours: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                placeholder={t("admin.createCompany.operatingHoursPlaceholder")}
                maxLength={100}
              />
            </label>
          </div>
        </div>

        {/* Online Presence */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t("admin.createCompany.onlinePresence")}
          </h3>

          <div className="grid gap-4">
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.website")}</span>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateFormData({ website: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                placeholder={t("admin.createCompany.websitePlaceholder")}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.facebook")}</span>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => updateFormData({ facebookUrl: e.target.value })}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                  placeholder={t("admin.createCompany.facebookPlaceholder")}
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.instagram")}</span>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => updateFormData({ instagramUrl: e.target.value })}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                  placeholder={t("admin.createCompany.instagramPlaceholder")}
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.twitter")}</span>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => updateFormData({ twitterUrl: e.target.value })}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                  placeholder={t("admin.createCompany.twitterPlaceholder")}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
