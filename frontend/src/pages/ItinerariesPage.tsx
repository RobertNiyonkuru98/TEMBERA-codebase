import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import ItineraryCard from "../components/ItineraryCard";
import type { Company, Itinerary } from "../types";
import {
  createBooking,
  createBookingItem,
  fetchCompanies,
  fetchItineraries,
} from "../api/platformApi";
import { useAuth } from "../AuthContext";

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

      {isLoading && (
        <p className="text-sm text-slate-300">Loading itineraries...</p>
      )}

      {!isLoading && itineraries.length === 0 && !error && (
        <p className="text-sm text-slate-300">No itineraries found.</p>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}

      {actionMessage && <p className="text-sm text-emerald-300">{actionMessage}</p>}
    </div>
  );
}

export default ItinerariesPage;

