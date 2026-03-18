import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import {
  fetchBookingItems,
  fetchCompanies,
  fetchItineraries,
} from "../api/platformApi";
import type { BookingItem, Company, Itinerary } from "../types";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Loader2, 
  Building2,
  DollarSign,
  Activity,
  Clock,
  Eye,
  Sparkles
} from "lucide-react";

function CompanyDashboardPage() {
  const { token, user } = useAuth();
  const { t } = useI18n();
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

  const totalRevenue = useMemo(() => {
    return itineraries.reduce((sum, itinerary) => {
      const attendeeCount = attendeesByItinerary.get(String(itinerary.id)) ?? 0;
      return sum + (itinerary.price * attendeeCount);
    }, 0);
  }, [itineraries, attendeesByItinerary]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center">
          <Building2 className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600 mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">No companies are linked to your account yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-7xl space-y-8">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 p-3 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("company.dashboard.title")}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">{companies[0]?.name}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("company.dashboard.subtitle")}
          </p>
        </header>

        {/* Stats Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Itineraries */}
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t("company.dashboard.totalItineraries")}
              </p>
              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{itineraries.length}</p>
            </div>
          </article>

          {/* Total Attendees */}
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/30 p-3">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t("company.dashboard.totalAttendees")}
              </p>
              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{bookingItems.length}</p>
            </div>
          </article>

          {/* Upcoming Events */}
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-purple-100 dark:bg-purple-900/30 p-3">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t("company.dashboard.upcomingEvents")}
              </p>
              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{upcomingItineraries.length}</p>
            </div>
          </article>

          {/* Total Revenue */}
          <article className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-3">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t("company.dashboard.totalRevenue")}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {totalRevenue.toLocaleString()} <span className="text-xl">RWF</span>
              </p>
            </div>
          </article>
        </section>

        {/* Upcoming Itineraries Section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500 p-2">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("company.dashboard.upcomingItineraries")}
                </h2>
              </div>
              <Link
                to="/company/itineraries"
                className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-all hover:gap-2"
              >
                {t("company.dashboard.viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {upcomingItineraries.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("company.dashboard.noUpcoming")}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingItineraries.map((itinerary) => (
                  <li
                    key={itinerary.id}
                    className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 p-3 shadow-md">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {itinerary.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(itinerary.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {itinerary.location ?? "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t("company.dashboard.attendees")}
                        </p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {attendeesByItinerary.get(String(itinerary.id)) ?? 0}
                        </p>
                      </div>
                      <Link
                        to={`/company/itinerary/${itinerary.id}/attendees`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                        {t("company.dashboard.view")}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CompanyDashboardPage;
