import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { fetchBookingItems, fetchCompanies, fetchItineraries } from "../api/platformApi";
import type { BookingItem, Company, Itinerary } from "../types";

function CompanyItinerariesPage() {
  const { user, token } = useAuth();
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
        const ownedCompanyIds = new Set(
          ownedCompanies.map((company) => String(company.id)),
        );

        setCompanies(ownedCompanies);
        const companyItineraries = allItineraries.filter((itinerary) =>
            ownedCompanyIds.has(String(itinerary.companyId)),
          );
        const companyItineraryIds = new Set(
          companyItineraries.map((itinerary) => String(itinerary.id)),
        );
        setItineraries(companyItineraries);
        setBookingItems(
          allBookingItems.filter((item) =>
            companyItineraryIds.has(String(item.itineraryId)),
          ),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load company itineraries",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token, user]);

  const companyById = useMemo(
    () => new Map(companies.map((company) => [String(company.id), company])),
    [companies],
  );

  const attendeesByItinerary = useMemo(() => {
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
          Company Itineraries
        </h1>
        <p className="text-sm text-slate-300">
          Itineraries belonging to companies owned by your account.
        </p>
      </header>

      {isLoading && <p className="text-sm text-slate-300">Loading itineraries...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!isLoading && !error && companies.length === 0 && (
        <p className="text-sm text-slate-300">
          No companies are linked to your user yet.
        </p>
      )}

      {!isLoading && !error && companies.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[880px] text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Attendees</th>
                <th className="px-4 py-3">Actions</th>
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
                    {attendeesByItinerary.get(String(itinerary.id)) ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/company/itinerary/${itinerary.id}/attendees`}
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
                    >
                      View attendees
                    </Link>
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

export default CompanyItinerariesPage;
