import { itineraries, companies } from "../mockData";
import { useI18n } from "../i18n";
import ItineraryCard from "../components/ItineraryCard";

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
          const company = companies.find((c) => c.id === itinerary.companyId);
          return (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} company={company} as="link" />
          );
        })}
      </div>
    </div>
  );
}

export default ItinerariesPage;

