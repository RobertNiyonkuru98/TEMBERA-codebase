import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import {
  fetchBookingItems,
  fetchCompanies,
  fetchItineraries,
} from "../api/platformApi";
import type { BookingItem, Company, Itinerary } from "../types";

function CompanyDashboardPage() {
  const { token, user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [allCompanies, allItineraries, allBookingItems] = await Promise.all([
          fetchCompanies(token),
          fetchItineraries(token),
          fetchBookingItems(token),
        ]);

        const ownedCompanies = allCompanies.filter(
          (company) => String(company.ownerId) === String(user.id),
        );
        const ownedCompanyIds = new Set(ownedCompanies.map((company) => String(company.id)));
        const companyItineraries = allItineraries.filter((itinerary) =>
          ownedCompanyIds.has(String(itinerary.companyId)),
        );
        const companyItineraryIds = new Set(
          companyItineraries.map((itinerary) => String(itinerary.id)),
        );

        setCompanies(ownedCompanies);
        setItineraries(companyItineraries);
        setBookingItems(
          allBookingItems.filter((item) => companyItineraryIds.has(String(item.itineraryId))),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load company dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token, user]);

  const upcomingItineraries = useMemo(
    () =>
      itineraries
        .filter((itinerary) => new Date(itinerary.date).getTime() >= Date.now())
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
        .slice(0, 5),
    [itineraries],
  );

  const attendeesByItinerary = useMemo(() => {
    const counts = new Map<string, number>();
    bookingItems.forEach((item) => {
      const key = String(item.itineraryId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [bookingItems]);

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading company dashboard...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (companies.length === 0) {
    return <p className="text-sm text-slate-300">No companies are linked to your account yet.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Company Dashboard</h1>
        <p className="text-sm text-slate-300">Quick performance view for your itineraries.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Number of itineraries</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{itineraries.length}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total attendees</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{bookingItems.length}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Upcoming itineraries</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{upcomingItineraries.length}</p>
        </article>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-100">Upcoming itineraries</h2>
        {upcomingItineraries.length === 0 ? (
          <p className="mt-3 text-sm text-slate-300">No upcoming itineraries.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {upcomingItineraries.map((itinerary) => (
              <li
                key={itinerary.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-100">{itinerary.title}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(itinerary.date).toLocaleDateString()} · {itinerary.location ?? "-"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-emerald-300">
                    {attendeesByItinerary.get(String(itinerary.id)) ?? 0} attendees
                  </p>
                  <Link
                    to={`/company/itinerary/${itinerary.id}/attendees`}
                    className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
                  >
                    View attendees
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default CompanyDashboardPage;
