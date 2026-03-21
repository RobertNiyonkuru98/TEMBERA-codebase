import { useEffect, useState } from "react";
import { Building2, Users, Loader2 } from "lucide-react";
import { useI18n } from "../../../i18n";
import { fetchUsers } from "../../../api/platformApi";
import type { User } from "../../../types";
import type { StepProps } from "./types";

interface BasicInfoStepProps extends StepProps {
  token: string;
  isAdmin?: boolean;
  currentUserId?: string;
  currentUserName?: string;
}

export function BasicInfoStep({ formData, updateFormData, token, isAdmin = true, currentUserId, currentUserName }: BasicInfoStepProps) {
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      if (!token || !isAdmin) return;
      try {
        setLoadingUsers(true);
        const allUsers = await fetchUsers(token);
        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoadingUsers(false);
      }
    }
    void loadUsers();
  }, [token, isAdmin]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t("admin.createCompany.basicInfo")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("admin.createCompany.basicInfoDesc")}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t("admin.createCompany.companyName")} <span className="text-red-500">{t("admin.createCompany.required")}</span>
            </span>
            <input
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
              placeholder={t("admin.createCompany.companyNamePlaceholder")}
              maxLength={100}
            />
          </label>

          {isAdmin ? (
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("admin.createCompany.companyOwner")} <span className="text-red-500">{t("admin.createCompany.required")}</span>
              </span>
              {loadingUsers ? (
                <div className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading users...
                </div>
              ) : (
                <select
                  value={formData.ownerId}
                  onChange={(e) => updateFormData({ ownerId: e.target.value })}
                  className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
                >
                  <option value="">{t("admin.createCompany.selectOwner")}</option>
                  {users.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              )}
            </label>
          ) : (
            <label className="space-y-2 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t("admin.createCompany.companyOwner")}
              </span>
              <div className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                {currentUserName || "You (Current User)"}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You will be automatically assigned as the owner
              </p>
            </label>
          )}
        </div>

        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.tagline")}</span>
          <input
            value={formData.tagline}
            onChange={(e) => updateFormData({ tagline: e.target.value })}
            className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all"
            placeholder={t("admin.createCompany.taglinePlaceholder")}
            maxLength={150}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("admin.createCompany.taglineHint")}
          </p>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{t("admin.createCompany.descriptionLabel")}</span>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={6}
            className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-4 transition-all resize-none"
            placeholder={t("admin.createCompany.descriptionPlaceholder")}
            maxLength={2000}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formData.description.length}/2000 {t("admin.createCompany.charactersCount")}
          </p>
        </label>
      </div>
    </div>
  );
}
