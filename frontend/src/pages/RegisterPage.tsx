import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import { User, Mail, Lock, Phone, ArrowRight, Sparkles } from "lucide-react";
import volcanoImg from "../assets/forigners_on_top_of_volcano.jpg";

function RegisterPage() {
  const { register, isLoading, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    clearError();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please provide name, email, and password.");
      return;
    }

    try {
      await register(
        name.trim(),
        email.trim(),
        password.trim(),
        phoneNumber.trim() || undefined,
      );
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center py-12">
      <div className="mx-auto w-[95%] max-w-[1200px]">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left Side - Visual */}
          <div className="hidden lg:block relative overflow-hidden rounded-3xl">
            <img
              src={volcanoImg}
              alt="Rwanda adventures"
              className="h-[700px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">{t("auth.startJourney")}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {t("auth.discoverRwanda")}
              </h2>
              <p className="text-slate-200 text-lg">
                {t("auth.discoverRwandaDesc")}
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("auth.registerTitle")}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {t("auth.registerSubtitle")}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 p-8 backdrop-blur-sm shadow-lg"
            >
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {t("auth.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-500 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {t("auth.email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-500 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {t("auth.phoneNumber")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-500 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="+250 7xx xxx xxx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 text-sm text-slate-500 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? "Creating account..." : t("auth.registerButton")}
                {!isLoading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-slate-900/50 px-4 text-slate-500">{t("auth.or")}</span>
                </div>
              </div>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                {t("auth.haveAccount")}{" "}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  {t("auth.loginLink")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

