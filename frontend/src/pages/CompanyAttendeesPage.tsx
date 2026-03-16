import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  fetchBookingItems,
  fetchBookings,
  fetchItineraryById,
  fetchUsers,
} from "../api/platformApi";
import type { Booking, BookingItem, Itinerary, User } from "../types";

type AttendeeRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  registrationDate: string;
};

function CompanyAttendeesPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
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

        const [fetchedItinerary, allItems, allBookings, allUsers] = await Promise.all([
          fetchItineraryById(token, id),
          fetchBookingItems(token),
          fetchBookings(token),
          fetchUsers(token),
        ]);

        setItinerary(fetchedItinerary);
        setBookingItems(allItems);
        setBookings(allBookings);
        setUsers(allUsers);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load attendees",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [id, token]);

  const attendees = useMemo<AttendeeRow[]>(() => {
    if (!itinerary) return [];

    const relevantBookingIds = new Set(
      bookingItems
        .filter((item) => String(item.itineraryId) === String(itinerary.id))
        .map((item) => String(item.bookingId)),
    );

    return bookings
      .filter((booking) => relevantBookingIds.has(String(booking.id)))
      .map((booking) => {
        const attendee = users.find((user) => String(user.id) === String(booking.userId));
        return {
          id: String(booking.id),
          name: attendee?.name ?? "Unknown",
          email: attendee?.email ?? "-",
          phone: attendee?.phoneNumber ?? "-",
          status: booking.status,
          registrationDate: booking.date,
        };
      });
  }, [bookingItems, bookings, itinerary, users]);

  const filteredAttendees = useMemo(() => {
    const search = query.trim().toLowerCase();

    return attendees.filter((attendee) => {
      const matchesStatus = statusFilter === "all" || attendee.status === statusFilter;
      if (!matchesStatus) return false;

      if (!search) return true;
      return (
        attendee.name.toLowerCase().includes(search) ||
        attendee.email.toLowerCase().includes(search) ||
        attendee.phone.toLowerCase().includes(search)
      );
    });
  }, [attendees, query, statusFilter]);

  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading attendees...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (!itinerary) {
    return <p className="text-sm text-slate-300">Itinerary not found.</p>;
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Attendees</h1>
        <p className="text-sm text-slate-300">
          {itinerary.title} · {new Date(itinerary.date).toLocaleDateString()} · {itinerary.location ?? "-"}
        </p>
      </header>

      <section className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:grid-cols-2">
        <label className="space-y-1 text-xs text-slate-300">
          Search attendee
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, phone"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
          />
        </label>

        <label className="space-y-1 text-xs text-slate-300">
          Filter by status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:border-emerald-400 focus:ring-2"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </section>

      {filteredAttendees.length === 0 ? (
        <p className="text-sm text-slate-300">No attendees match the current filters.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full min-w-[860px] text-left text-sm text-slate-200">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Attendee name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registration date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="border-b border-slate-800/60">
                  <td className="px-4 py-3">{attendee.name}</td>
                  <td className="px-4 py-3">{attendee.email}</td>
                  <td className="px-4 py-3">{attendee.phone}</td>
                  <td className="px-4 py-3 capitalize">{attendee.status}</td>
                  <td className="px-4 py-3">{new Date(attendee.registrationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CompanyAttendeesPage;
