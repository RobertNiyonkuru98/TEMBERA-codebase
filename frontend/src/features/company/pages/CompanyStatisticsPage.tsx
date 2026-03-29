import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  fetchBookingItems,
  fetchCompanies,
  fetchItineraries,
} from "@/core/api";
import type { BookingItem, Company, Itinerary } from "@/shared/types";

function CompanyStatisticsPage() {
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
        const companyItineraryIds = new Set(companyItineraries.map((item) => String(item.id)));

        setCompanies(ownedCompanies);
        setItineraries(companyItineraries);
        setBookingItems(
          allBookingItems.filter((item) => companyItineraryIds.has(String(item.itineraryId))),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load company statistics",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token, user]);

  const attendeesPerItinerary = useMemo(() => {
    const counts = new Map<string, number>();
    bookingItems.forEach((item) => {
      const key = String(item.itineraryId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [bookingItems]);

  const performanceRows = useMemo(
    () =>
      itineraries
        .map((itinerary) => ({
          itinerary,
          attendees: attendeesPerItinerary.get(String(itinerary.id)) ?? 0,
        }))
        .sort((a, b) => b.attendees - a.attendees),
    [attendeesPerItinerary, itineraries],
  );

  const totalAttendees = bookingItems.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-64 rounded-lg bg-slate-800"></div>
          <div className="h-4 w-96 rounded-lg bg-slate-800/60"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-700"></div>
              <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-slate-800"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="flex gap-4">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-slate-700"></div>
            </div>
          </div>
          <div className="divide-y divide-slate-800/60">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="px-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-48 animate-pulse rounded-lg bg-slate-800"></div>
                  <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-800"></div>
                  <div className="h-6 w-24 animate-pulse rounded-lg bg-slate-800"></div>
                  <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-800"></div>
                  <div className="h-6 w-16 animate-pulse rounded-lg bg-slate-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Company Statistics</h1>
        <p className="text-sm text-slate-300">Attendees per itinerary and itinerary performance.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Number of itineraries</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{itineraries.length}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total attendees</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{totalAttendees}</p>
        </article>
      </section>

      {performanceRows.length === 0 ? (
        <p className="text-sm text-slate-300">No itinerary performance data available yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[760px] text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Itinerary</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Attendees</th>
                <th className="px-4 py-3">Performance</th>
              </tr>
            </thead>
            <tbody>
              {performanceRows.map(({ itinerary, attendees }) => {
                const performance =
                  attendees >= 20 ? "High" : attendees >= 10 ? "Medium" : "Low";

                return (
                  <tr key={itinerary.id} className="border-b border-slate-800/60">
                    <td className="px-4 py-3">{itinerary.title}</td>
                    <td className="px-4 py-3">{new Date(itinerary.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{itinerary.location ?? "-"}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-300">{attendees}</td>
                    <td className="px-4 py-3">{performance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CompanyStatisticsPage;
