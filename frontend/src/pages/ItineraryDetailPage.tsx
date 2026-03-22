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
import { MapPin, Calendar, DollarSign, Building2, Users, ArrowLeft, Loader2, Clock, Star, CheckCircle2, XCircle, Utensils, Car, Shield, Info, TrendingUp, AlertCircle } from "lucide-react";

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
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{t("detail.loadingDetails")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto w-[95%] max-w-480 py-12">
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
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto w-[95%] max-w-480 py-12">
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
      <div className="mx-auto w-[95%] max-w-480 py-12">
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
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-block rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                    {itinerary.activity ?? "Experience"}
                  </span>
                  {itinerary.category && (
                    <span className="inline-block rounded-full bg-blue-500/80 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                      {itinerary.category}
                    </span>
                  )}
                  {itinerary.isFeatured && (
                    <span className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg flex items-center gap-1">
                      <Star className="h-4 w-4 fill-white" /> Featured
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-white sm:text-5xl mb-3">
                  {itinerary.title}
                </h1>
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {itinerary.imageUrls && itinerary.imageUrls.length > 0 && (
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Image Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {itinerary.imageUrls.map((imgUrl, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-xl h-48 group cursor-pointer shadow-sm">
                    <img
                      src={imgUrl}
                      alt={`${itinerary.title} gallery ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Video Gallery */}
          {itinerary.videoUrls && itinerary.videoUrls.length > 0 && (
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Video Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {itinerary.videoUrls.map((videoUrl, idx) => (
                  <div key={idx} className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <video
                      controls
                      className="w-full h-64 object-cover"
                      preload="metadata"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      <source src={videoUrl} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Description & Ratings */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 space-y-6">
            {itinerary.description && (
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{itinerary.description}</p>
            )}
            
            {/* Ratings */}
            {itinerary.averageRating && itinerary.totalRatings && itinerary.totalRatings > 0 && (
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {itinerary.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    / 10
                  </span>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  ({itinerary.totalRatings} {itinerary.totalRatings === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </div>

          {/* Success Message */}
          {actionMessage && (
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-4">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{actionMessage}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-8">
            {/* Trip Information Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Basic Information */}
              <section className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Basic Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Date</dt>
                      <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                        {new Date(itinerary.date).toLocaleDateString()}
                      </dd>
                    </div>
                  </div>
                  {itinerary.location && (
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Location</dt>
                        <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{itinerary.location}</dd>
                      </div>
                    </div>
                  )}
                  {(itinerary.durationDays || itinerary.durationHours) && (
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Duration</dt>
                        <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                          {itinerary.durationDays ? `${itinerary.durationDays} day${itinerary.durationDays > 1 ? 's' : ''}` : ''}
                          {itinerary.durationDays && itinerary.durationHours ? ' ' : ''}
                          {itinerary.durationHours ? `${itinerary.durationHours} hour${itinerary.durationHours > 1 ? 's' : ''}` : ''}
                        </dd>
                      </div>
                    </div>
                  )}
                  {company && (
                    <div className="flex items-start gap-4">
                      <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Company</dt>
                        <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{company.name}</dd>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Pricing & Capacity */}
              <section className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pricing & Capacity</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Base Price</dt>
                      <dd className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {itinerary.price.toLocaleString()} {itinerary.currency || 'RWF'}
                      </dd>
                    </div>
                  </div>
                  {(itinerary.minParticipants || itinerary.maxParticipants || itinerary.groupMinSize || itinerary.groupDiscountPercent) && (
                    <div className="flex items-start gap-4">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Participants & Groups</dt>
                        <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                          {(itinerary.minParticipants || itinerary.maxParticipants) && (
                            <div>
                              {itinerary.minParticipants && itinerary.maxParticipants
                                ? `${itinerary.minParticipants} - ${itinerary.maxParticipants} people`
                                : itinerary.maxParticipants
                                ? `Up to ${itinerary.maxParticipants} people`
                                : `Minimum ${itinerary.minParticipants} people`}
                            </div>
                          )}
                          {itinerary.groupMinSize && (
                            <div className="text-sm mt-1 text-blue-600 dark:text-blue-400">
                              Groups: Min {itinerary.groupMinSize} people
                              {itinerary.groupDiscountPercent ? ` (${itinerary.groupDiscountPercent}% discount)` : ''}
                            </div>
                          )}
                        </dd>
                      </div>
                    </div>
                  )}
                  {itinerary.availableSlots !== null && itinerary.availableSlots !== undefined && (
                    <div className="flex items-start gap-4">
                      <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Available Slots</dt>
                        <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                          {itinerary.availableSlots} {itinerary.availableSlots === 1 ? 'slot' : 'slots'}
                        </dd>
                      </div>
                    </div>
                  )}
                  {itinerary.bookingDeadline && (
                    <div className="flex items-start gap-4">
                      <Clock className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Booking Deadline</dt>
                        <dd className="mt-1 text-base font-semibold text-red-600 dark:text-red-400">
                          {new Date(itinerary.bookingDeadline).toLocaleDateString()}
                        </dd>
                      </div>
                    </div>
                  )}
                  {itinerary.difficultyLevel && (
                    <div className="flex items-start gap-4">
                      <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <div>
                        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Difficulty</dt>
                        <dd className="mt-1">
                          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-semibold text-purple-700 dark:text-purple-300">
                            {itinerary.difficultyLevel}
                          </span>
                        </dd>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Inclusions & Exclusions */}
            {(itinerary.inclusions?.length || itinerary.exclusions?.length) && (
              <div className="grid gap-8 lg:grid-cols-2">
                {itinerary.inclusions && itinerary.inclusions.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      What's Included
                    </h2>
                    <ul className="space-y-2">
                      {itinerary.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {itinerary.exclusions && itinerary.exclusions.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      What's Not Included
                    </h2>
                    <ul className="space-y-2">
                      {itinerary.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {/* Meals & Transport */}
            <div className="grid gap-8 lg:grid-cols-2">
              {itinerary.mealsIncluded && (
                <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Meals
                  </h2>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Included:</span> Yes
                    </p>
                    {itinerary.mealTypes && itinerary.mealTypes.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Meal Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {itinerary.mealTypes.map((meal, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                              {meal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {itinerary.dietaryAccommodations && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Dietary Options:</span> {itinerary.dietaryAccommodations}
                      </p>
                    )}
                    {itinerary.foodOptions && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Details:</span> {itinerary.foodOptions}
                      </p>
                    )}
                    {(itinerary.canBringOwnFood || itinerary.canBuyFoodOnsite) && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {itinerary.canBringOwnFood && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Bring own food allowed
                          </span>
                        )}
                        {itinerary.canBuyFoodOnsite && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Food available onsite
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}
              {itinerary.transportIncluded && (
                <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Transport
                  </h2>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Included:</span> Yes
                    </p>
                    {itinerary.transportType && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Type:</span> {itinerary.transportType}
                      </p>
                    )}
                    {itinerary.pickupLocations && itinerary.pickupLocations.length > 0 && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Pickup:</span> {itinerary.pickupLocations.join(', ')}
                      </p>
                    )}
                    {itinerary.dropoffLocations && itinerary.dropoffLocations.length > 0 && (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Dropoff:</span> {itinerary.dropoffLocations.join(', ')}
                      </p>
                    )}
                    {itinerary.transportNotes && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                        <span className="font-semibold">Notes:</span> {itinerary.transportNotes}
                      </p>
                    )}
                    {(itinerary.allowsOwnTransport || itinerary.parkingAvailable) && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {itinerary.allowsOwnTransport && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-blue-500" /> Own transport okay
                          </span>
                        )}
                        {itinerary.parkingAvailable && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            <CheckCircle2 className="h-3 w-3 text-blue-500" /> Parking available
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Schedule Details */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Schedule</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {itinerary.scheduleDetails || 'No schedule details available for this itinerary'}
              </p>
            </section>

            {/* Equipment & Items */}
            <div className="grid gap-8 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Provided Equipment</h2>
                <ul className="space-y-2">
                  {(itinerary.providedEquipment && itinerary.providedEquipment.length > 0) ? (
                    itinerary.providedEquipment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-500 italic">
                      No equipment provided for this itinerary
                    </li>
                  )}
                </ul>
              </section>
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">What to Bring</h2>
                <ul className="space-y-2">
                  {(itinerary.requiredItems && itinerary.requiredItems.length > 0) ? (
                    itinerary.requiredItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2 text-sm text-slate-400 dark:text-slate-500 italic">
                      No specific items required for this itinerary
                    </li>
                  )}
                </ul>
              </section>
            </div>

            {/* Meeting & Location Details */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Meeting & Location Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Meeting Point</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.meetingPoint || 'No specific meeting point specified'}
                  </p>
                  {(itinerary.meetingPointLat && itinerary.meetingPointLng) && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      GPS: {itinerary.meetingPointLat}, {itinerary.meetingPointLng}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">End Point</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.endPoint || 'No specific end point specified'}
                  </p>
                  {(itinerary.endPointLat && itinerary.endPointLng) && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      GPS: {itinerary.endPointLat}, {itinerary.endPointLng}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Additional Location Info</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.locationDetails || 'No additional location information available'}
                  </p>
                </div>
              </div>
            </section>

            {/* Fitness & Requirements */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Requirements</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Fitness Level</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.fitnessLevelRequired || 'No specific fitness requirements'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Accessibility</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.accessibilityInfo || 'No specific accessibility information available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Age Restrictions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.ageRestrictionsNotes || 'No specific age restrictions'}
                  </p>
                </div>
              </div>
            </section>

            {/* Pricing Details */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Pricing Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price per Person</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {itinerary.pricePerPerson ? `${itinerary.pricePerPerson.toLocaleString()} ${itinerary.currency || 'RWF'}` : 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price per Group</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {itinerary.pricePerGroup ? `${itinerary.pricePerGroup.toLocaleString()} ${itinerary.currency || 'RWF'}` : 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Deposit Required</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.depositRequired 
                      ? `${itinerary.depositRequired.toLocaleString()} ${itinerary.currency || 'RWF'}${itinerary.depositPercentage ? ` (${itinerary.depositPercentage}%)` : ''}`
                      : 'No deposit required'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Refund Policy</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.refundPolicy || 'No refund policy specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Cancellation Policy</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {itinerary.cancellationPolicy || 'No cancellation policy specified'}
                  </p>
                </div>
                {itinerary.paymentMethods && itinerary.paymentMethods.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Accepted Payment Methods</p>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.paymentMethods.map((method, idx) => (
                        <span key={idx} className="inline-block px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {method.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Safety & Requirements */}
            {(itinerary.insuranceIncluded || itinerary.safetyMeasures || itinerary.emergencyProcedures || itinerary.medicalRequirements || itinerary.minAge || itinerary.maxAge) && (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Safety & Requirements
                </h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {itinerary.insuranceIncluded && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">Insurance Included</span>
                      </div>
                    )}
                    {(itinerary.minAge || itinerary.maxAge) && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Age: {itinerary.minAge && itinerary.maxAge ? `${itinerary.minAge}-${itinerary.maxAge} years` : itinerary.minAge ? `${itinerary.minAge}+ years` : `Up to ${itinerary.maxAge} years`}
                        </span>
                      </div>
                    )}
                  </div>
                  {itinerary.insuranceDetails && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Insurance Details</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.insuranceDetails}</p>
                    </div>
                  )}
                  {itinerary.safetyMeasures && Array.isArray(itinerary.safetyMeasures) && itinerary.safetyMeasures.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Safety Measures</p>
                      <ul className="space-y-1">
                        {itinerary.safetyMeasures.map((measure, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                            {measure}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {itinerary.emergencyProcedures && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Emergency Procedures</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.emergencyProcedures}</p>
                    </div>
                  )}
                  {itinerary.medicalRequirements && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Medical Requirements</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.medicalRequirements}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Guide & Languages */}
            {(itinerary.guideInfo || itinerary.languagesOffered?.length) && (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Guide Information</h2>
                <div className="space-y-4">
                  {itinerary.guideInfo && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">About Your Guide</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.guideInfo}</p>
                    </div>
                  )}
                  {itinerary.languagesOffered && itinerary.languagesOffered.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Languages Offered</p>
                      <div className="flex flex-wrap gap-2">
                        {itinerary.languagesOffered.map((lang, idx) => (
                          <span key={idx} className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Weather & What to Wear */}
            {(itinerary.weatherDependency || itinerary.weatherNotes || itinerary.whatToWear) && (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Weather & Preparation</h2>
                <div className="space-y-4">
                  {itinerary.weatherDependency && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">This activity is weather dependent</span>
                    </div>
                  )}
                  {itinerary.weatherNotes && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Weather Information</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.weatherNotes}</p>
                    </div>
                  )}
                  {itinerary.whatToWear && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">What to Wear</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{itinerary.whatToWear}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Additional Notes & Terms */}
            {(itinerary.additionalNotes || itinerary.termsAndConditions) && (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Additional Information</h2>
                <div className="space-y-4">
                  {itinerary.additionalNotes && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Additional Notes</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{itinerary.additionalNotes}</p>
                    </div>
                  )}
                  {itinerary.termsAndConditions && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Terms & Conditions</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{itinerary.termsAndConditions}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Bookings Section */}
            <section className="space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
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
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAttending ? t("detail.attending") : t("detail.attendButton")}
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDetailPage;
