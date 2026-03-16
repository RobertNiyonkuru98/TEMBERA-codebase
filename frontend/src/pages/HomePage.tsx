import { itineraries, companies } from "../mockData";
import ItineraryCard from "../components/ItineraryCard";
import { useI18n } from "../i18n";

function HomePage() {
  const featuredItineraries = itineraries.slice(0, 3);
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      <div className="relative w-screen h-[60vh] max-h-[420px] mb-8 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/bX_wOIZW1RM?autoplay=1&mute=1&controls=0&loop=1&playlist=bX_wOIZW1RM"
          title="Visit Rwanda Hero Video"
          className="absolute top-1/2 left-1/2 w-[120vw] h-[67.5vw] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/80 z-10" />

        <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white text-center drop-shadow-lg">
            Discover Rwanda with
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Curated Local Experience
            </span>
          </h1>
        </div>
      </div>  
      <section className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] items-center">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            {t("home.badge")}
          </p>
          {/* Hero title is now overlaid on the video above */}
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
            const company = companies.find((c) => c.id === itinerary.companyId);
            return (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} company={company} as="a" />
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

