import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { createCompany } from "../api/platformApi";

function CompanyRegisterPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !user) {
      toast.error("You must be logged in with company role.");
      return;
    }

    if (!name.trim()) {
      toast.error("Company name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createCompany(token, {
        name: name.trim(),
        description: description.trim() || undefined,
        contact: contact.trim() || undefined,
        owner_id: String(user.id),
      });
      toast.success("Company registered successfully!");
      navigate("/company/itineraries/create", { replace: true });
    } catch (submitError) {
      const errorMsg =
        submitError instanceof Error
          ? submitError.message
          : "Failed to register company";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Register Your Company</h1>
        <p className="text-sm text-slate-300">You need to register a company to continue.</p>
      </header>

      <section className="rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-200">
        <p className="font-medium">Company setup required</p>
        <p className="mt-1 text-amber-100/90">
          Your company role is active, but your account has no company profile yet. Create one to unlock your workspace.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <label className="space-y-1 text-sm text-slate-200">
          <span>Company name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="e.g. Lake Kivu Tours"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-200">
          <span>Contact</span>
          <input
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="Phone or email"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-200">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="Describe your company and services"
          />
        </label>

        {error && (
          <p className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating..." : "Create Company"}
        </button>
      </form>
    </div>
  );
}

export default CompanyRegisterPage;
