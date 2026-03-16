import { itineraries, companies } from "../mockData";
import { useI18n } from "../i18n";

function HomePage() {
  const featuredItineraries = itineraries.slice(0, 3);
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            {t("home.badge")}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Discover Rwanda with curated{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              local experiences
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl">
            {t("home.heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/itineraries"
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition"
            >
              {t("home.ctaExplore")}
            </a>
            <a
              href="/bookings"
              className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition"
            >
              {t("home.ctaBookings")}
            </a>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-200">
                {companies.length}+
              </p>
              <p>{t("home.statsCompanies")}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                {itineraries.length}+
              </p>
              <p>{t("home.statsItineraries")}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                {t("home.statsMockTitle")}
              </p>
              <p>{t("home.statsMockSubtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">
            {t("home.featuredTitle")}
          </h2>
          <a
            href="/itineraries"
            className="text-xs text-emerald-300 hover:text-emerald-200"
          >
            {t("home.featuredLink")}
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItineraries.map((itinerary) => {
            const company = companies.find(
              (c) => c.id === itinerary.companyId,
            );
            return (
              <a
                key={itinerary.id}
                href={`/itineraries/${itinerary.id}`}
                className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-400/70 hover:bg-slate-900 transition"
              >
                <div className="flex items-center justify-between gap-2 pb-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
                    {itinerary.activity ?? "Experience"}
                  </p>
                  <p className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
                    {new Date(itinerary.date).toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-sm font-semibold text-slate-50 group-hover:text-emerald-200">
                  {itinerary.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                  {itinerary.description}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {itinerary.location}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-emerald-300">
                    {itinerary.price.toLocaleString()} RWF
                  </p>
                  {company && (
                    <p className="text-[11px] text-slate-400">
                      by <span className="text-slate-200">{company.name}</span>
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

