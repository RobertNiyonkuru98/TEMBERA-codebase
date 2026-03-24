import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  fetchBookingItems,
  fetchBookings,
  fetchCompanies,
  fetchItineraries,
  fetchUsers,
} from "@/core/api";
import type { Booking, BookingItem, Company, Itinerary, User } from "@/shared/types";

type DashboardState = {
  users: User[];
  companies: Company[];
  itineraries: Itinerary[];
  bookings: Booking[];
  bookingItems: BookingItem[];
};

function metricCard(label: string, value: number) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-emerald-300">{value}</p>
    </article>
  );
}

function AdminDashboardPage() {
  const { token } = useAuth();
  const [state, setState] = useState<DashboardState>({
    users: [],
    companies: [],
    itineraries: [],
    bookings: [],
    bookingItems: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [users, companies, itineraries, bookings, bookingItems] = await Promise.all([
          fetchUsers(token),
          fetchCompanies(token),
          fetchItineraries(token),
          fetchBookings(token),
          fetchBookingItems(token),
        ]);

        setState({ users, companies, itineraries, bookings, bookingItems });
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token]);

  const registrationsByItinerary = useMemo(() => {
    const counts = new Map<string, number>();
    state.bookingItems.forEach((item) => {
      const key = String(item.itineraryId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [state.bookingItems]);

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading admin dashboard...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">Platform-wide statistics and activity overview.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCard("Total users", state.users.length)}
        {metricCard("Total companies", state.companies.length)}
        {metricCard("Total itineraries", state.itineraries.length)}
        {metricCard("Total itinerary registrations", state.bookingItems.length)}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-100">Most registered itineraries</h2>
        {state.itineraries.length === 0 ? (
          <p className="mt-3 text-sm text-slate-300">No itineraries available.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-slate-200">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Itinerary</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Registrations</th>
                </tr>
              </thead>
              <tbody>
                {state.itineraries
                  .slice()
                  .sort(
                    (a, b) =>
                      (registrationsByItinerary.get(String(b.id)) ?? 0) -
                      (registrationsByItinerary.get(String(a.id)) ?? 0),
                  )
                  .slice(0, 8)
                  .map((itinerary) => (
                    <tr key={itinerary.id} className="border-b border-slate-800/60">
                      <td className="px-4 py-3">{itinerary.title}</td>
                      <td className="px-4 py-3">{new Date(itinerary.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{itinerary.location ?? "-"}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-300">
                        {registrationsByItinerary.get(String(itinerary.id)) ?? 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboardPage;
