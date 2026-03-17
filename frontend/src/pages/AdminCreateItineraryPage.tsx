import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { createItinerary, fetchCompanies } from "../api/platformApi";
import type { Company } from "../types";

function AdminCreateItineraryPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  const [companyId, setCompanyId] = useState("");
  const [title, setTitle] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompanies() {
      if (!token) {
        setIsLoadingCompanies(false);
        return;
      }

      try {
        setIsLoadingCompanies(true);
        setError(null);
        const allCompanies = await fetchCompanies(token);
        setCompanies(allCompanies);
        if (allCompanies.length > 0) {
          setCompanyId(String(allCompanies[0].id));
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load companies",
        );
      } finally {
        setIsLoadingCompanies(false);
      }
    }

    void loadCompanies();
  }, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in to create an itinerary.");
      return;
    }

    if (!companyId || !title.trim() || !date || !price.trim()) {
      toast.error("Company, title, date, and price are required.");
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Price must be a valid number greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createItinerary(token, {
        company_id: companyId,
        title: title.trim(),
        activity: activity.trim() || undefined,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        date,
        price: numericPrice,
      });
      toast.success("Itinerary created successfully!");
      navigate("/admin/itineraries", { replace: true });
    } catch (submitError) {
      const errorMsg =
        submitError instanceof Error
          ? submitError.message
          : "Failed to create itinerary";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Create Itinerary</h1>
        <p className="text-sm text-slate-300">Create an itinerary for any company.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <label className="space-y-1 text-sm text-slate-200">
          <span>Company</span>
          <select
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            disabled={isLoadingCompanies || companies.length === 0}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
          >
            {companies.map((company) => (
              <option key={company.id} value={String(company.id)}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-200">
          <span>Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="e.g. Kigali Cultural City Tour"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-200">
            <span>Activity</span>
            <input
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="e.g. Hiking"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-200">
            <span>Location</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="e.g. Kigali"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-200">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-200">
            <span>Price (RWF)</span>
            <input
              type="number"
              min="1"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="50000"
            />
          </label>
        </div>

        <label className="space-y-1 text-sm text-slate-200">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="What travelers should expect"
          />
        </label>

        {companies.length === 0 && !isLoadingCompanies && (
          <p className="rounded-md border border-amber-900 bg-amber-950/40 px-3 py-2 text-xs text-amber-300">
            No companies found. Create a company first.
          </p>
        )}

        {error && (
          <p className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || companies.length === 0}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating..." : "Create Itinerary"}
          </button>
          <Link
            to="/admin/itineraries"
            className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateItineraryPage;
