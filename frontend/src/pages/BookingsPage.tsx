import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import {
  deleteBooking,
  fetchBookingItems,
  fetchBookings,
  fetchItineraries,
  fetchCompanies,
  updateBooking,
} from "../api/platformApi";
import type { Booking, BookingItem, Itinerary, Company } from "../types";
import { 
  Trash2, 
  Save, 
  X, 
  Plus, 
  Loader2,
  Package,
  Edit2,
  Users
} from "lucide-react";

type DraftMember = {
  name: string;
  email: string;
  phone: string;
};

function getItineraryImage(itinerary: Itinerary): string | undefined {
  if (itinerary.imageUrls && itinerary.imageUrls.length > 0) {
    return itinerary.imageUrls[0];
  }

  return itinerary.imageUrl;
}

function BookingsPage() {
  const { user, token } = useAuth();
  const { t } = useI18n();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftMembers, setDraftMembers] = useState<DraftMember[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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
      setError(loadError instanceof Error ? loadError.message : "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const userBookings = useMemo(() => {
    if (!user) return [];

    return bookings.filter((booking) => String(booking.userId) === String(user.id));
  }, [bookings, user]);

  if (!user) {
    return null;
  }

  function beginEdit(booking: Booking) {
    setEditingBookingId(String(booking.id));
    setDraftDescription(booking.description ?? "");
    setDraftDate(new Date(booking.date).toISOString().slice(0, 10));
    setDraftMembers(
      (booking.members ?? []).map((member) => ({
        name: member.name,
        email: member.email ?? "",
        phone: member.phone ?? "",
      })),
    );
  }

  function addMember() {
    setDraftMembers((prev) => [...prev, { name: "", email: "", phone: "" }]);
  }

  function removeMember(index: number) {
    setDraftMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMemberField(index: number, field: keyof DraftMember, value: string) {
    setDraftMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  async function saveBooking(booking: Booking) {
    if (!token) {
      toast.error("Something went wrong");
      return;
    }

    const members = draftMembers
      .map((member) => ({
        name: member.name.trim(),
        email: member.email.trim() || undefined,
        phone: member.phone.trim() || undefined,
      }))
      .filter((member) => member.name.length > 0);

    if (booking.type === "group" && members.length === 0) {
      toast.error("Add at least one person for group booking");
      return;
    }

    try {
      setIsSaving(true);
      await updateBooking(token, String(booking.id), {
        description: draftDescription,
        date: draftDate,
        type: booking.type,
        members: booking.type === "group" ? members : [],
      });

      toast.success("Booking updated");
      setEditingBookingId(null);
      await loadData();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function removeBooking(bookingId: string) {
    if (!token) {
      toast.error("Something went wrong");
      return;
    }

    try {
      await deleteBooking(token, bookingId);
      toast.success("Booking deleted");
      await loadData();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Something went wrong";
      toast.error(message);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-600 dark:text-slate-400">{t("bookings.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="mx-auto w-[95%] max-w-7xl space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("bookings.title")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t("bookings.subtitle")}
          </p>
        </header>

        {userBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-12 text-center">
            <Package className="h-16 w-16 text-slate-400 dark:text-slate-600 mb-4" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">{t("bookings.noBookings")}</p>
          </div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

            const isEditing = editingBookingId === String(booking.id);
            const coverItinerary = linkedItineraries[0];
            const coverImage = coverItinerary ? getItineraryImage(coverItinerary) : undefined;

            return (
              <section
                key={booking.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-lg transition-all hover:shadow-xl"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={coverItinerary?.title ?? "Booked itinerary"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Booking #{booking.id}</p>
                        <p className="text-xs text-slate-200">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold capitalize text-white shadow-lg">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => beginEdit(booking)}
                      disabled={editingBookingId !== null && !isEditing}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 className="h-4 w-4" />
                      {t("bookings.edit")}
                    </button>
                    <button
                      type="button"
                      disabled={editingBookingId !== null && !isEditing}
                      onClick={() => {
                        if (window.confirm(t("bookings.deleteConfirm"))) {
                          void removeBooking(String(booking.id));
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                {isEditing ? (
                  <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("bookings.description")}</span>
                      <textarea
                        value={draftDescription}
                        onChange={(event) => setDraftDescription(event.target.value)}
                        className="min-h-[80px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                        placeholder={t("newBooking.notePlaceholder")}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("bookings.date")}</span>
                      <input
                        type="date"
                        value={draftDate}
                        onChange={(event) => setDraftDate(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                    </label>

                    {booking.type === "group" && (
                      <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("bookings.members")}</p>
                          </div>
                          <button
                            type="button"
                            onClick={addMember}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-600"
                          >
                            <Plus className="h-3 w-3" />
                            {t("bookings.addMember")}
                          </button>
                        </div>
                        <div className="space-y-2">
                          {draftMembers.map((member, index) => (
                            <div
                              key={`${String(booking.id)}-member-${index}`}
                              className="grid gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3 sm:grid-cols-3"
                            >
                              <input
                                type="text"
                                placeholder={t("bookings.memberName")}
                                value={member.name}
                                onChange={(event) =>
                                  updateMemberField(index, "name", event.target.value)
                                }
                                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              />
                              <input
                                type="email"
                                placeholder={t("bookings.memberEmail")}
                                value={member.email}
                                onChange={(event) =>
                                  updateMemberField(index, "email", event.target.value)
                                }
                                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder={t("bookings.memberPhone")}
                                  value={member.phone}
                                  onChange={(event) =>
                                    updateMemberField(index, "phone", event.target.value)
                                  }
                                  className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeMember(index)}
                                  className="inline-flex items-center justify-center rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 text-xs text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-900/30"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          void saveBooking(booking);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t("bookings.saving")}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            {t("bookings.save")}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBookingId(null)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <X className="h-4 w-4" />
                        {t("bookings.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {booking.description && (
                      <p className="text-xs text-slate-300">"{booking.description}"</p>
                    )}

                    {booking.members && booking.members.length > 0 && (
                      <details className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2">
                        <summary className="cursor-pointer text-xs font-semibold text-slate-200">
                          View members ({booking.members.length})
                        </summary>
                        <ul className="mt-2 space-y-1 text-xs text-slate-300">
                          {booking.members.map((member) => (
                            <li key={member.id}>
                              {member.name} · {member.email ?? "-"} · {member.phone ?? "-"}
                            </li>
                          ))}
                        </ul>
                      </details>
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
                              className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2"
                            >
                              <div className="flex items-center gap-2">
                                {getItineraryImage(itinerary) ? (
                                  <img
                                    src={getItineraryImage(itinerary)}
                                    alt={itinerary.title}
                                    className="h-12 w-12 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-md bg-slate-800" />
                                )}

                                <div>
                                <p className="font-medium text-slate-100">{itinerary.title}</p>
                                <p className="text-slate-400">
                                  {itinerary.location} · {new Date(itinerary.date).toLocaleDateString()}
                                </p>
                                <p className="text-slate-400">
                                  {companies.find(
                                    (company) =>
                                      String(company.id) === String(itinerary.companyId),
                                  )?.name ?? "Unknown company"}
                                </p>
                                </div>
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
                  </>
                )}
                </div>
              </section>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

export default BookingsPage;
