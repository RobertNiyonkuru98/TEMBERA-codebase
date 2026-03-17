import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { createItinerary, fetchCompanies } from "../api/platformApi";
import type { Company } from "../types";

function CompanyCreateItineraryPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);

  const [title, setTitle] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMyCompany() {
      if (!token || !user) {
        setIsLoadingCompany(false);
        return;
      }

      try {
        setIsLoadingCompany(true);
        setError(null);

        const allCompanies = await fetchCompanies(token);
        const ownedCompany =
          allCompanies.find((item) => String(item.ownerId) === String(user.id)) ?? null;

        setCompany(ownedCompany);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load company",
        );
      } finally {
        setIsLoadingCompany(false);
      }
    }

    void loadMyCompany();
  }, [token, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !company) {
      toast.error("No company found for this account.");
      return;
    }

    if (!title.trim() || !date || !price.trim()) {
      toast.error("Title, date, and price are required.");
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
        company_id: String(company.id),
        title: title.trim(),
        activity: activity.trim() || undefined,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        date,
        price: numericPrice,
      });
      toast.success("Your first itinerary created successfully!");
      navigate("/company/itineraries", { replace: true });
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

  if (isLoadingCompany) {
    return <p className="text-sm text-slate-300">Loading company profile...</p>;
  }

  if (!company) {
    return (
      <div className="space-y-3 rounded-xl border border-amber-900 bg-amber-950/30 p-5 text-amber-100">
        <h1 className="text-lg font-semibold">Company profile required</h1>
        <p className="text-sm text-amber-200">
          You need to register a company before creating itineraries.
        </p>
        <Link
          to="/company/register"
          className="inline-flex rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Create Company
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Create Your First Itinerary</h1>
        <p className="text-sm text-slate-300">Create your first itinerary to start.</p>
        <p className="text-xs text-slate-400">Company: {company.name}</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <label className="space-y-1 text-sm text-slate-200">
          <span>Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
            placeholder="e.g. Nyungwe Rainforest Experience"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-200">
            <span>Activity</span>
            <input
              value={activity}
              onChange={(event) => setActivity(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="e.g. Nature walk"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-200">
            <span>Location</span>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
              placeholder="e.g. Nyungwe"
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
            placeholder="Describe your itinerary"
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
          {isSubmitting ? "Creating..." : "Create Itinerary"}
        </button>
      </form>
    </div>
  );
}

export default CompanyCreateItineraryPage;
