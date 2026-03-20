import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { createCompany } from "../api/platformApi";

function AdminCreateCompanyPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [ownerId, setOwnerId] = useState(user ? String(user.id) : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in to create a company.");
      return;
    }

    if (!name.trim() || !ownerId.trim()) {
      toast.error("Company name and owner ID are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createCompany(token, {
        name: name.trim(),
        description: description.trim() || undefined,
        contact: contact.trim() || undefined,
        owner_id: ownerId.trim(),
      });
      toast.success("Company created successfully!");
      navigate("/admin/companies", { replace: true });
    } catch (submitError) {
      const errorMsg =
        submitError instanceof Error
          ? submitError.message
          : "Failed to create company";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Create Company</h1>
        <p className="text-sm text-slate-300">Create a company profile on behalf of any user.</p>
      </header>

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
            placeholder="e.g. Kigali Adventures"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-200">
          <span>Owner ID</span>
          <input
            value={ownerId}
            onChange={(event) => setOwnerId(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="User ID that will own this company"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-200">
          <span>Contact</span>
          <input
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="Phone or email contact"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-200">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="Short company description"
          />
        </label>

        {error && (
          <p className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating..." : "Create Company"}
          </button>
          <Link
            to="/admin/companies"
            className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateCompanyPage;
