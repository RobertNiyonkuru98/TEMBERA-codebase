import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { fetchBookingItems, fetchCompanies, fetchItineraries } from "../api/platformApi";
import type { BookingItem, Company, Itinerary } from "../types";
import { Loader2, Map as MapIcon, Plus, Eye, Users, Calendar, MapPin, Building2 } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-lg">Loading itineraries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center">
        <p className="text-lg font-semibold text-red-900 dark:text-red-100">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
            <MapIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Itineraries</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage all published itineraries across the platform
            </p>
          </div>
        </div>
        <Link
          to="/admin/itineraries/create"
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" />
          Create Itinerary
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Itineraries</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{itineraries.length}</p>
            </div>
            <MapIcon className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Companies</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {new Set(itineraries.map((i) => i.companyId)).size}
              </p>
            </div>
            <Building2 className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Registrations</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{bookingItems.length}</p>
            </div>
            <Users className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Itineraries Table */}
      {itineraries.length === 0 ? (
        <div className="rounded-xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-8 text-center">
          <MapIcon className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">No itineraries found</p>
          <p className="text-sm text-amber-700 dark:text-amber-200 mt-2">Create the first itinerary for a company</p>
          <Link
            to="/admin/itineraries/create"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Itinerary
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Itinerary
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Company
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Details
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Price
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center">
                    Attendees
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {itineraries.map((itinerary) => {
                  const company = companyById.get(String(itinerary.companyId));
                  return (
                    <tr key={itinerary.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50">
                            <MapIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-50">{itinerary.title}</p>
                            {itinerary.activity && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{itinerary.activity}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {company?.logoUrl ? (
                            <img src={company.logoUrl} alt="" className="w-5 h-5 rounded-sm object-cover" />
                          ) : (
                            <Building2 className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-slate-900 dark:text-slate-200 font-medium">
                            {company?.name ?? "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {itinerary.location && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span className="truncate max-w-37.5">{itinerary.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{new Date(itinerary.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {itinerary.price.toLocaleString()} RWF
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700/50 text-purple-800 dark:text-purple-300 text-sm font-semibold rounded-lg">
                          {registrationsByItinerary.get(String(itinerary.id)) ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/itineraries/${itinerary.id}`}
                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminItinerariesPage;
