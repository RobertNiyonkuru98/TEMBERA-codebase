import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function ProfilePage() {
  const { user, saveProfile, removeAccount, isLoading, clearError } = useAuth();
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
      setSuccessMessage("Profile updated successfully.");
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Profile</h1>
        <p className="mt-1 text-sm text-slate-300">
          Manage your personal information and account.
        </p>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Account details
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">User ID</dt>
            <dd className="text-slate-100 break-all">{String(user.id)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Role</dt>
            <dd className="text-slate-100 uppercase">{user.role}</dd>
          </div>
        </dl>
      </section>

      <form
        onSubmit={handleUpdate}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Update profile
        </h2>

        <div className="space-y-1">
          <label htmlFor="name" className="block text-xs text-slate-300">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs text-slate-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-xs text-slate-300">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="+250 7xx xxx xxx"
          />
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-md border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
      </form>

      <section className="rounded-xl border border-red-900/50 bg-red-950/20 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-300">
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-red-200/90">
          Deleting your account is irreversible and removes your access.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="mt-4 rounded-md border border-red-500/70 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Processing..." : "Delete account"}
        </button>
      </section>
    </div>
  );
}

export default ProfilePage;
