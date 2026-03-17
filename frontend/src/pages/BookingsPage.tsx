import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useI18n } from "../i18n";
import {
  deleteBooking,
  fetchBookingItems,
  fetchBookings,
  fetchCompanies,
  fetchItineraries,
  updateBooking,
} from "../api/platformApi";
import type { Booking, BookingItem, Company, Itinerary } from "../types";

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
    return <p className="text-sm text-slate-300">Loading your bookings...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">{t("bookings.title")}</h1>
        <p className="text-sm text-slate-300">
          {t("bookings.subtitle")} <span className="font-semibold">{user.name}</span>
        </p>
      </header>

      {userBookings.length === 0 ? (
        <p className="text-sm text-slate-300">{t("bookings.empty")}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                className="space-y-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={coverItinerary?.title ?? "Booked itinerary"}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="h-36 w-full bg-slate-800" />
                )}

                <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Booking #{booking.id}</p>
                    <p className="text-xs text-slate-400">
                      Created on {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">Type: {booking.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-200">
                      {booking.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => beginEdit(booking)}
                      disabled={editingBookingId !== null && !isEditing}
                      className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={editingBookingId !== null && !isEditing}
                      onClick={() => {
                        void removeBooking(String(booking.id));
                      }}
                      className="rounded-md border border-red-800 px-2 py-1 text-xs text-red-300 hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                    <label className="space-y-1 text-xs text-slate-300">
                      Description
                      <textarea
                        value={draftDescription}
                        onChange={(event) => setDraftDescription(event.target.value)}
                        className="min-h-[70px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                      />
                    </label>

                    <label className="space-y-1 text-xs text-slate-300">
                      Booking date
                      <input
                        type="date"
                        value={draftDate}
                        onChange={(event) => setDraftDate(event.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
                      />
                    </label>

                    {booking.type === "group" && (
                      <div className="space-y-2 rounded-md border border-slate-800 bg-slate-900/70 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-200">Members</p>
                          <button
                            type="button"
                            onClick={addMember}
                            className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
                          >
                            Add member
                          </button>
                        </div>
                        {draftMembers.map((member, index) => (
                          <div
                            key={`${String(booking.id)}-member-${index}`}
                            className="grid gap-2 rounded-md border border-slate-800 p-2 md:grid-cols-3"
                          >
                            <input
                              type="text"
                              placeholder="Name"
                              value={member.name}
                              onChange={(event) =>
                                updateMemberField(index, "name", event.target.value)
                              }
                              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                            />
                            <input
                              type="email"
                              placeholder="Email"
                              value={member.email}
                              onChange={(event) =>
                                updateMemberField(index, "email", event.target.value)
                              }
                              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Phone"
                                value={member.phone}
                                onChange={(event) =>
                                  updateMemberField(index, "phone", event.target.value)
                                }
                                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                              />
                              <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className="rounded-md border border-slate-700 px-2 text-xs text-slate-300 hover:bg-slate-800"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          void saveBooking(booking);
                        }}
                        className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-70"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBookingId(null)}
                        className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
                      >
                        Cancel
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
  );
}

export default BookingsPage;
