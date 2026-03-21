import { MapPin, Mail } from "lucide-react";
import { useI18n } from "../../../i18n";
import { COUNTRIES } from "../../../constants/companyOptions";
import type { StepProps } from "./types";

export function LocationContactStep({ formData, updateFormData }: StepProps) {
  const { t } = useI18n();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("admin.createCompany.locationContact")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("admin.createCompany.locationContactDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t("admin.createCompany.location")}
          </h3>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.address")}</span>
            <input
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
              placeholder={t("admin.createCompany.addressPlaceholder")}
              maxLength={500}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.city")}</span>
              <input
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                placeholder={t("admin.createCompany.cityPlaceholder")}
                maxLength={100}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.country")}</span>
              <select
                value={formData.country}
                onChange={(e) => updateFormData({ country: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Contact Section */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t("admin.createCompany.contactInfo")}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.emailLabel")}</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                placeholder={t("admin.createCompany.emailPlaceholder")}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.phoneLabel")}</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                placeholder={t("admin.createCompany.phonePlaceholder")}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
