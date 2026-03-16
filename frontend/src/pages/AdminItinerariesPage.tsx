import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchBookingItems, fetchCompanies, fetchItineraries } from "../api/platformApi";
import type { BookingItem, Company, Itinerary } from "../types";

function AdminItinerariesPage() {
  const { token } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
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
        const [allItineraries, allCompanies, allBookingItems] = await Promise.all([
          fetchItineraries(token),
          fetchCompanies(token),
          fetchBookingItems(token),
        ]);
        setItineraries(allItineraries);
        setCompanies(allCompanies);
        setBookingItems(allBookingItems);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load itineraries",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token]);

  const companyById = useMemo(
    () => new Map(companies.map((company) => [String(company.id), company])),
    [companies],
  );

  const registrationsByItinerary = useMemo(() => {
    const counts = new Map<string, number>();
    bookingItems.forEach((item) => {
      const key = String(item.itineraryId);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [bookingItems]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Admin Itineraries
        </h1>
        <p className="text-sm text-slate-300">All itineraries published by companies.</p>
      </header>

      {isLoading && <p className="text-sm text-slate-300">Loading itineraries...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[880px] text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Registered users</th>
              </tr>
            </thead>
            <tbody>
              {itineraries.map((itinerary) => (
                <tr key={itinerary.id} className="border-b border-slate-800/60">
                  <td className="px-4 py-3">{itinerary.title}</td>
                  <td className="px-4 py-3">
                    {companyById.get(String(itinerary.companyId))?.name ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3">{itinerary.location ?? "-"}</td>
                  <td className="px-4 py-3">
                    {new Date(itinerary.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-300">
                    {itinerary.price.toLocaleString()} RWF
                  </td>
                  <td className="px-4 py-3">
                    {registrationsByItinerary.get(String(itinerary.id)) ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminItinerariesPage;
