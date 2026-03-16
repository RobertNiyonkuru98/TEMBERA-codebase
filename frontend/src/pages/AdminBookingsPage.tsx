import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchBookings, fetchUsers } from "../api/platformApi";
import type { Booking, User } from "../types";

function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    void loadBookings();
  }, [token]);

  const userById = useMemo(
    () => new Map(users.map((user) => [String(user.id), user])),
    [users],
  );

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
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const user = userById.get(String(booking.userId));
                return (
                  <tr key={booking.id} className="border-b border-slate-800/60">
                    <td className="px-4 py-3">{booking.id}</td>
                    <td className="px-4 py-3">{user?.name ?? booking.userId}</td>
                    <td className="px-4 py-3 capitalize">{booking.status}</td>
                    <td className="px-4 py-3">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{booking.description ?? "-"}</td>
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
