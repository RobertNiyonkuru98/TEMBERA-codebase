import { type SubmitEventHandler, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const from = (location.state as { from?: string } | null)?.from ?? "/bookings";

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = function (event) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    login(email, password);

    navigate(from, { replace: true });
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {t("auth.loginTitle")}
        </h1>
        <p className="text-sm text-slate-300">
          {t("auth.loginSubtitle")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
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

        {error && (
          <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition"
        >
          {t("auth.loginButton")}
        </button>

        <p className="text-xs text-slate-400 text-center">
          {t("auth.noAccount")}{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-300 hover:text-emerald-200"
          >
            {t("auth.registerLink")}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;

