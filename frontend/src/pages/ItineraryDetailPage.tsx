import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../AuthContext";
import {
  createBooking,
  createBookingItem,
  fetchBookingItems,
  fetchBookings,
  fetchCompanies,
  fetchItineraryById,
  fetchUsers,
} from "../api/platformApi";
import type { Booking, BookingItem, Company, Itinerary, User } from "../types";

type BookingSummaryRow = {
  booking: Booking;
  userName: string;
};

function ItineraryDetailPage() {
  const { t } = useI18n();
  const { token, user, activeRole } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!token || !id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [fetchedItinerary, companies, allBookings, allBookingItems, allUsers] =
          await Promise.all([
            fetchItineraryById(token, id),
            fetchCompanies(token),
            fetchBookings(token),
            fetchBookingItems(token),
            fetchUsers(token),
          ]);

        setItinerary(fetchedItinerary);
        setCompany(
          companies.find(
            (item) => String(item.id) === String(fetchedItinerary.companyId),
          ),
        );
        setBookings(allBookings);
        setBookingItems(allBookingItems);
        setUsers(allUsers);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load itinerary details",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [id, token]);

  const bookingSummary = useMemo<BookingSummaryRow[]>(() => {
    if (!itinerary) return [];

    const relatedItemBookingIds = new Set(
      bookingItems
        .filter((item) => String(item.itineraryId) === String(itinerary.id))
        .map((item) => String(item.bookingId)),
    );

    return bookings
      .filter((booking) => relatedItemBookingIds.has(String(booking.id)))
      .map((booking) => {
        const user = users.find(
          (item) => String(item.id) === String(booking.userId),
        );

        return {
          booking,
          userName: user?.name ?? "Unknown user",
        };
      });
  }, [bookingItems, bookings, itinerary, users]);

  async function handleAttend() {
    if (!token || !user || !itinerary) {
      setError("Please login to register for an itinerary.");
      return;
    }

    try {
      setIsAttending(true);
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

      setActionMessage("Registration successful. You can review it under My Registrations.");
    } catch (attendError) {
      setError(
        attendError instanceof Error
          ? attendError.message
          : "Failed to register for itinerary",
      );
    } finally {
      setIsAttending(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading itinerary details...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-300">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-slate-800"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-300">The requested itinerary could not be found.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-slate-800"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden rounded-xl">
      {itinerary.imageUrl && (
        <img
          src={itinerary.imageUrl}
          alt={itinerary.title}
          className="mb-6 h-64 w-full rounded-t-xl object-cover shadow-lg"
        />
      )}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          {itinerary.activity ?? "Experience"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {itinerary.title}
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">{itinerary.description}</p>
        {actionMessage && <p className="text-sm text-emerald-300">{actionMessage}</p>}
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[2fr,1.1fr]">
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-100">{t("detail.tripInfo")}</h2>
          <dl className="grid grid-cols-1 gap-3 text-xs text-slate-300 sm:grid-cols-2">
            <div>
              <dt className="text-slate-400">{t("detail.date")}</dt>
              <dd className="font-medium">{new Date(itinerary.date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-slate-400">{t("detail.location")}</dt>
              <dd className="font-medium">{itinerary.location}</dd>
            </div>
            <div>
              <dt className="text-slate-400">{t("detail.priceLabel")}</dt>
              <dd className="font-medium text-emerald-300">
                {itinerary.price.toLocaleString()} RWF
              </dd>
            </div>
            {company && (
              <div>
                <dt className="text-slate-400">{t("detail.company")}</dt>
                <dd className="font-medium">{company.name}</dd>
              </div>
            )}
          </dl>
        </section>

        <aside className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-100">
            {t("detail.bookingsTitle")}
          </h2>

          {bookingSummary.length > 0 ? (
            <ul className="space-y-3 text-xs text-slate-300">
              {bookingSummary.map(({ booking, userName }) => (
                <li
                  key={booking.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 p-3"
                >
                  <p className="font-medium text-slate-100">
                    Booking #{booking.id} · <span className="capitalize">{booking.status}</span>
                  </p>
                  <p className="text-slate-400">By {userName}</p>
                  <p className="text-slate-400">
                    Created on {new Date(booking.date).toLocaleDateString()}
                  </p>
                  {booking.description && (
                    <p className="mt-1 text-slate-400">"{booking.description}"</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">{t("detail.noBookings")}</p>
          )}

          {activeRole === "user" && (
            <button
              type="button"
              onClick={() => {
                void handleAttend();
              }}
              disabled={isAttending}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAttending ? "Attending..." : "Attend"}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ItineraryDetailPage;
