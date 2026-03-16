import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import {
  fetchBookingItems,
  fetchBookings,
  fetchCompanies,
  fetchItineraries,
} from "../api/platformApi";
import type { Booking, BookingItem, Company, Itinerary } from "../types";

function BookingsPage() {
  const { user, token } = useAuth();
  const { t } = useI18n();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
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
        const [allBookings, allBookingItems, allItineraries, allCompanies] = await Promise.all([
          fetchBookings(token),
          fetchBookingItems(token),
          fetchItineraries(token),
          fetchCompanies(token),
        ]);

        setBookings(allBookings);
        setBookingItems(allBookingItems);
        setItineraries(allItineraries);
        setCompanies(allCompanies);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load bookings",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [token, user]);

  const userBookings = useMemo(() => {
    if (!user) return [];

    return bookings.filter(
      (booking) => String(booking.userId) === String(user.id),
    );
  }, [bookings, user]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {t("bookings.title")}
        </h1>
        <p className="text-sm text-slate-300">
          {t("bookings.subtitle")} <span className="font-semibold">{user.name}</span>
        </p>
      </header>

      {userBookings.length === 0 ? (
        <p className="text-sm text-slate-300">{t("bookings.empty")}</p>
      ) : (
        <div className="space-y-4">
          {userBookings.map((booking) => {
            const items = bookingItems.filter(
              (item) => String(item.bookingId) === String(booking.id),
            );

            const linkedItineraries = items
              .map((item) =>
                itineraries.find(
                  (itinerary) => String(itinerary.id) === String(item.itineraryId),
                ),
              )
              .filter((itinerary): itinerary is Itinerary => Boolean(itinerary));

            return (
              <section
                key={booking.id}
                className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Booking #{booking.id}
                    </p>
                    <p className="text-xs text-slate-400">
                      Created on {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-200">
                    {booking.status}
                  </span>
                </div>

                {booking.description && (
                  <p className="text-xs text-slate-300">"{booking.description}"</p>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-200">
                    {t("bookings.itinerariesInBooking")}
                  </p>
                  {linkedItineraries.length > 0 ? (
                    <ul className="space-y-1 text-xs text-slate-300">
                      {linkedItineraries.map((itinerary) => (
                        <li
                          key={itinerary.id}
                          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2"
                        >
                          <div>
                            <p className="font-medium text-slate-100">{itinerary.title}</p>
                            <p className="text-slate-400">
                              {itinerary.location} · {new Date(itinerary.date).toLocaleDateString()}
                            </p>
                            <p className="text-slate-400">
                              {companies.find((company) => String(company.id) === String(itinerary.companyId))?.name ?? "Unknown company"}
                            </p>
                          </div>
                          <p className="font-semibold text-emerald-300">
                            {itinerary.price.toLocaleString()} RWF
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">
                      This booking currently has no linked itineraries.
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
