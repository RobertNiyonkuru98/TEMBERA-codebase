import { Link } from "react-router-dom";
import { itineraries, companies } from "../mockData";
import { useI18n } from "../i18n";

function ItinerariesPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {t("itineraries.title")}
        </h1>
        <p className="text-sm text-slate-300">
          {t("itineraries.subtitle")}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {itineraries.map((itinerary) => {
          const company = companies.find(
            (c) => c.id === itinerary.companyId,
          );

          return (
            <Link
              key={itinerary.id}
              to={`/itineraries/${itinerary.id}`}
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
              <h2 className="text-sm font-semibold text-slate-50 group-hover:text-emerald-200">
                {itinerary.title}
              </h2>
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
                    by{" "}
                    <span className="text-slate-200">{company.name}</span>
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ItinerariesPage;

