import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";

function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please provide name, email, and password.");
      return;
    }

    register(name.trim(), email.trim(), password.trim(), phoneNumber.trim() || undefined);
    navigate("/bookings", { replace: true });
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {t("auth.registerTitle")}
        </h1>
        <p className="text-sm text-slate-300">
          {t("auth.registerSubtitle")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <div className="space-y-1 text-sm">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-slate-200"
          >
            {t("auth.fullName")}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label
            htmlFor="phone"
            className="block text-xs font-medium text-slate-200"
          >
            {t("auth.phone")}
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="+250 7xx xxx xxx"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-slate-200"
          >
            {t("auth.password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1 text-sm">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-200"
          >
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
        >
          {t("auth.registerButton")}
        </button>

        <p className="text-xs text-slate-400 text-center">
          {t("auth.haveAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-300 hover:text-emerald-200"
          >
            {t("auth.loginLink")}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;

