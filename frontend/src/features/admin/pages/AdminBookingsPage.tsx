/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import { deleteBooking, fetchBookings, fetchUsers, updateBooking } from "@/core/api";
import type { Booking, User } from "@/shared/types";

function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftStatus, setDraftStatus] = useState<"pending" | "confirmed" | "cancelled">("pending");

  async function loadBookings() {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const [allBookings, allUsers] = await Promise.all([
        fetchBookings(token),
        fetchUsers(token),
      ]);
      setBookings(allBookings);
      setUsers(allUsers);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load bookings",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, [token]);

  const userById = useMemo(
    () => new Map(users.map((user) => [String(user.id), user])),
    [users],
  );

  function beginEdit(booking: Booking) {
    setEditingBookingId(String(booking.id));
    setDraftDescription(booking.description ?? "");
    setDraftDate(new Date(booking.date).toISOString().slice(0, 10));
    setDraftStatus(booking.status);
  }

  async function saveBooking(booking: Booking) {
    if (!token) {
      toast.error("Something went wrong");
      return;
    }

    try {
      await updateBooking(token, String(booking.id), {
        description: draftDescription,
        date: draftDate,
        status: draftStatus,
        type: booking.type,
        members: booking.members?.map((member) => ({
          name: member.name,
          email: member.email,
          phone: member.phone,
        })),
      });
      toast.success("Booking updated");
      setEditingBookingId(null);
      await loadBookings();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Something went wrong";
      toast.error(message);
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
      await loadBookings();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Something went wrong";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Admin Bookings
        </h1>
        <p className="text-sm text-slate-300">All bookings in the system.</p>
      </header>

      {isLoading && <p className="text-sm text-slate-300">Loading bookings...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[760px] text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const user = userById.get(String(booking.userId));
                const isEditing = editingBookingId === String(booking.id);
                return (
                  <tr key={booking.id} className="border-b border-slate-800/60">
                    <td className="px-4 py-3">{booking.id}</td>
                    <td className="px-4 py-3">{user?.name ?? booking.userId}</td>
                    <td className="px-4 py-3 capitalize">
                      {isEditing ? (
                        <select
                          value={draftStatus}
                          onChange={(event) =>
                            setDraftStatus(event.target.value as "pending" | "confirmed" | "cancelled")
                          }
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      ) : (
                        booking.status
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="date"
                          value={draftDate}
                          onChange={(event) => setDraftDate(event.target.value)}
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                        />
                      ) : (
                        new Date(booking.date).toLocaleDateString()
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          value={draftDescription}
                          onChange={(event) => setDraftDescription(event.target.value)}
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                        />
                      ) : (
                        booking.description ?? "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <details>
                        <summary className="cursor-pointer text-xs text-slate-300">
                          View ({booking.members?.length ?? 0})
                        </summary>
                        <ul className="mt-1 space-y-1 text-xs text-slate-400">
                          {(booking.members ?? []).map((member) => (
                            <li key={member.id}>
                              {member.name} · {member.email ?? "-"} · {member.phone ?? "-"}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                void saveBooking(booking);
                              }}
                              className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-semibold text-slate-950"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingBookingId(null)}
                              className="rounded-md border border-slate-700 px-2 py-1 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => beginEdit(booking)}
                              className="rounded-md border border-slate-700 px-2 py-1 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void removeBooking(String(booking.id));
                              }}
                              className="rounded-md border border-red-800 px-2 py-1 text-xs text-red-300"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;
