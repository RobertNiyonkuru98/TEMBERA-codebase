import { useEffect, useState } from "react";
import { useI18n } from "@/core/i18n";
import ItineraryCard from "@/features/itineraries/components/ItineraryCard";
import type { Company, Itinerary } from "@/shared/types";
import {
  createBooking,
  createBookingItem,
  fetchCompanies,
  fetchItineraries,
} from "@/core/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Search, Filter, Loader2 } from "lucide-react";

function ItinerariesPage() {
  const { token, user, activeRole } = useAuth();
  const { t } = useI18n();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendingItineraryId, setAttendingItineraryId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedItineraries, fetchedCompanies] = await Promise.all([
          fetchItineraries(token ? token : 'undefined'),
          fetchCompanies(token ? token : 'undefined'),
        ]);

        setItineraries(fetchedItineraries);
        setCompanies(fetchedCompanies);
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

  async function handleAttend(itinerary: Itinerary) {
    if (!token || !user) {
      setError("Please login to register for an itinerary.");
      return;
    }

    try {
      setAttendingItineraryId(String(itinerary.id));
      setError(null);
      setActionMessage(null);

      const booking = await createBooking(token, {
        user_id: String(user.id),
        description: `Registration for ${itinerary.title}`,
        status: "pending",
        date: new Date().toISOString().slice(0, 10),
      });

      await createBookingItem(token, {
        booking_id: String(booking.id),
        itinerary_id: String(itinerary.id),
      });

      setActionMessage(`Successfully registered for ${itinerary.title}.`);
    } catch (attendError) {
      setError(
        attendError instanceof Error
          ? attendError.message
          : "Failed to register for itinerary",
      );
    } finally {
      setAttendingItineraryId(null);
    }
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto w-[95%] max-w-[1920px] space-y-8 py-12">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {t("itineraries.pageTitle")}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              {t("itineraries.pageSubtitle")}
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder={t("itineraries.searchPlaceholder")}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
              <Filter className="h-4 w-4" />
              {t("itineraries.filterAll")}
            </button>
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{t("itineraries.loading")}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-6 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {actionMessage && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{actionMessage}</p>
          </div>
        )}

        {/* Itineraries Grid */}
        {!isLoading && !error && (
          <>
            {itineraries.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {itineraries.map((itinerary) => {
                  const company = companies.find(
                    (c) => String(c.id) === String(itinerary.companyId),
                  );
                  return (
                    <ItineraryCard
                      key={itinerary.id}
                      itinerary={itinerary}
                      company={company}
                      as="link"
                      onAttend={activeRole === "user" ? handleAttend : undefined}
                      isAttending={attendingItineraryId === String(itinerary.id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4">
                  <Search className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-400">{t("itineraries.noResults")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ItinerariesPage;

