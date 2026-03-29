import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { useI18n } from "@/core/i18n";
import { User, Mail, Phone, Shield, Trash2, Save, Loader2 } from "lucide-react";

function ProfilePage() {
  const { user, saveProfile, removeAccount, isLoading, clearError } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    clearError();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim() || !email.trim()) {
      setErrorMessage("Name and email are required.");
      return;
    }

    try {
      await saveProfile(name.trim(), email.trim(), phoneNumber.trim() || undefined);
      setSuccessMessage(t("profile.updateSuccess"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update profile",
      );
    }
  }

  async function handleDelete() {
    clearError();
    setSuccessMessage(null);
    setErrorMessage(null);

    const confirmed = window.confirm(
      "This action will permanently delete your account. Continue?",
    );
    if (!confirmed) return;

    try {
      await removeAccount();
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete account",
      );
    }
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("profile.title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t("profile.subtitle")}
          </p>
        </div>

        {/* Account Details Card */}
        <section className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg transition-all hover:shadow-xl">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500 p-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("profile.accountDetails")}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t("profile.userId")}
                </dt>
                <dd className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-2 font-mono text-sm text-slate-900 dark:text-slate-100">
                  {String(user.id)}
                </dd>
              </div>
              <div className="space-y-2">
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t("profile.role")}
                </dt>
                <dd className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-400">
                  {user.role}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Update Profile Form */}
        <form
          onSubmit={handleUpdate}
          className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500 p-2">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("profile.updateProfile")}
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("profile.fullName")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("profile.phoneNumber")}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="+250 7xx xxx xxx"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4 text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("profile.saving")}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {t("profile.saveChanges")}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <section className="group overflow-hidden rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 shadow-lg transition-all hover:shadow-xl">
          <div className="border-b border-red-200 dark:border-red-900/50 bg-linear-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/20 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-500 p-2">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-300">
                {t("profile.dangerZone")}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              {t("profile.deleteWarning")}
            </p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-red-500 dark:border-red-600 bg-transparent px-6 py-3 text-sm font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("profile.deleting")}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {t("profile.deleteAccount")}
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
