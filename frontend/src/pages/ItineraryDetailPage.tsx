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
import { toast } from "sonner";
import { MapPin, Calendar, DollarSign, Building2, Users, ArrowLeft, Loader2 } from "lucide-react";

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

      toast.info("Registration successful. You can review it under My Bookings.");
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
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{t("detail.loadingDetails")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto w-[95%] max-w-[1920px] py-12">
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-8 text-center space-y-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("detail.goBack")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto w-[95%] max-w-[1920px] py-12">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("detail.notFound")}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("detail.goBack")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto w-[95%] max-w-[1920px] py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("detail.goBack")}
        </button>

        <div className="space-y-8">
          {/* Hero Image */}
          {itinerary.imageUrl && (
            <div className="relative overflow-hidden rounded-3xl h-96 shadow-2xl">
              <img
                src={itinerary.imageUrl}
                alt={itinerary.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg mb-4">
                  {itinerary.activity ?? "Experience"}
                </span>
                <h1 className="text-4xl font-bold text-white sm:text-5xl mb-3">
                  {itinerary.title}
                </h1>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{itinerary.description}</p>
          </div>

          {/* Success Message */}
          {actionMessage && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{actionMessage}</p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid items-start gap-8 lg:grid-cols-[2fr,1fr]">
            {/* Trip Information */}
            <section className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("detail.tripInfo")}</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/20 p-3">
                    <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("detail.date")}</dt>
                    <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {new Date(itinerary.date).toLocaleDateString()}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/20 p-3">
                    <MapPin className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("detail.location")}</dt>
                    <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{itinerary.location}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/20 p-3">
                    <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("detail.priceLabel")}</dt>
                    <dd className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {itinerary.price.toLocaleString()} RWF
                    </dd>
                  </div>
                </div>
                {company && (
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/20 p-3">
                      <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{t("detail.company")}</dt>
                      <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{company.name}</dd>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Bookings Sidebar */}
            <aside className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("detail.bookingsTitle")}
                </h2>
              </div>

              {bookingSummary.length > 0 ? (
                <ul className="space-y-4">
                  {bookingSummary.map(({ booking, userName }) => (
                    <li
                      key={booking.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-4 space-y-2"
                    >
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {t("detail.bookingNumber")} #{booking.id}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="capitalize inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          {booking.status}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t("detail.by")} <span className="font-medium text-slate-900 dark:text-white">{userName}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {t("detail.createdOn")} {new Date(booking.date).toLocaleDateString()}
                      </p>
                      {booking.description && (
                        <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">"{booking.description}"</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("detail.noBookings")}</p>
              )}

              {activeRole === "user" && (
                <button
                  type="button"
                  onClick={() => {
                    void handleAttend();
                  }}
                  disabled={isAttending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAttending ? t("detail.attending") : t("detail.attendButton")}
                </button>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDetailPage;
