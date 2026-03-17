import { useEffect, useMemo, useState } from "react";
import ItineraryCard from "../components/ItineraryCard";
import { useI18n } from "../i18n";
import { Link } from "react-router-dom";
import {
  createBooking,
  createBookingItem,
  fetchCompanies,
  fetchItineraries,
} from "../api/platformApi";
import type { Company, Itinerary } from "../types";
import { useAuth } from "../AuthContext";

function HomePage() {
  const { token, user, activeRole } = useAuth();
  const { t } = useI18n();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [attendingItineraryId, setAttendingItineraryId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
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
        const [fetchedItineraries, fetchedCompanies] = await Promise.all([
          fetchItineraries(token),
          fetchCompanies(token),
        ]);
        setItineraries(fetchedItineraries);
        setCompanies(fetchedCompanies);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load home data",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token]);

  const featuredItineraries = useMemo(() => itineraries.slice(0, 6), [itineraries]);
  const spotlight = featuredItineraries[0];
  const spotlightCompany = companies.find(
    (company) => String(company.id) === String(spotlight?.companyId),
  );

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
    <div className="space-y-10">
      <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-8 sm:px-6">
        <div className="space-y-3 text-center">
          <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            {t("home.badge")}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            Plan your next trip with confidence
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            Compare local experiences, find trusted operators, and book unforgettable Rwanda adventures in one place.
          </p>
        </div>

        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          {[
            "Hotels",
            "Things to do",
            "Restaurants",
            "Tours",
            "Weekend plans",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              className="rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 font-medium text-slate-200 transition hover:border-emerald-400/60 hover:text-emerald-300"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Search destinations, activities, companies"
            className="h-10 w-full bg-transparent px-3 text-sm text-slate-100 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Search
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
        <article className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {spotlight?.imageUrl ? (
            <img
              src={spotlight.imageUrl}
              alt={spotlight.title}
              className="h-64 w-full object-cover md:h-full"
            />
          ) : (
            <div className="h-64 w-full bg-slate-900 md:h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs uppercase tracking-wide text-emerald-300">
              Featured escape
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-50 sm:text-2xl">
              {spotlight?.title}
            </h2>
            <p className="mt-1 text-sm text-slate-200">
              {spotlightCompany?.name} · {spotlight?.location}
            </p>
          </div>
        </article>

        <div className="grid gap-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="text-lg font-semibold text-slate-50">Top rated by young travelers</h3>
            <p className="mt-2 text-sm text-slate-300">
              Discover social-friendly locations, short trip options, and affordable local experiences.
            </p>
            <Link
              to="/itineraries"
              className="mt-4 inline-flex rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-800"
            >
              Explore itineraries
            </Link>
          </article>

          <article className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <h3 className="text-lg font-semibold text-emerald-200">Trusted local companies</h3>
            <p className="mt-2 text-sm text-emerald-100/80">
              {companies.length}+ curated operators with authentic Rwanda experiences.
            </p>
            <Link
              to="/visitor/showcase"
              className="mt-4 inline-flex rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Learn why Tembera
            </Link>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">
            {t("home.featuredTitle")}
          </h2>
          <Link
            to="/itineraries"
            className="text-xs text-emerald-300 hover:text-emerald-200"
          >
            {t("home.featuredLink")}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItineraries.map((itinerary) => {
            const company = companies.find(
              (c) => String(c.id) === String(itinerary.companyId),
            );
            return (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                company={company}
                as="a"
                onAttend={activeRole === "user" ? handleAttend : undefined}
                isAttending={attendingItineraryId === String(itinerary.id)}
              />
            );
          })}
        </div>
      </section>

      {isLoading && (
        <p className="text-sm text-slate-300">Loading live data...</p>
      )}

      {error && (
        <p className="text-sm text-red-300">{error}</p>
      )}

      {actionMessage && (
        <p className="text-sm text-emerald-300">{actionMessage}</p>
      )}

      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:grid-cols-3">
        <div>
          <p className="text-2xl font-semibold text-slate-100">{companies.length}+</p>
          <p className="text-xs text-slate-400">{t("home.statsCompanies")}</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-100">{itineraries.length}+</p>
          <p className="text-xs text-slate-400">{t("home.statsItineraries")}</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-100">24/7</p>
          <p className="text-xs text-slate-400">Youth trip inspiration</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

