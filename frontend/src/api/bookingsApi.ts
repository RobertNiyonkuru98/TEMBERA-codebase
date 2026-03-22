import type { Booking, BookingItem, BookingMember } from "../types";
import { BaseApiService } from "./baseApi";
import { requestHelper } from "./requestHelper";
import { API_BASE_URL, getAuthHeaders } from "./config";

export type BackendBooking = {
  id: string;
  user_id: string;
  itinerary_id?: string | null;
  type?: string;
  description?: string | null;
  status: string;
  date: string;
  members?: BackendBookingMember[];
  created_at?: string;
};

export type BackendBookingMember = {
  id: string;
  booking_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

export type BackendBookingItem = {
  id: string;
  itinerary_id: string;
  booking_id: string;
};

export type CreateBookingPayload = {
  user_id: string;
  itineraryId?: string;
  type?: "personal" | "group";
  description?: string;
  status?: string;
  date: string;
  members?: Array<{
    name: string;
    email?: string;
    phone?: string;
  }>;
};

export type UpdateBookingPayload = {
  itineraryId?: string;
  type?: "personal" | "group";
  description?: string;
  status?: string;
  date?: string;
  members?: Array<{
    name: string;
    email?: string;
    phone?: string;
  }>;
};

export type UpsertBookingMemberPayload = {
  name: string;
  email?: string;
  phone?: string;
};

export type CreateBookingItemPayload = {
  booking_id: string;
  itinerary_id: string;
};

export function mapBooking(booking: BackendBooking): Booking {
  const normalizedStatus = booking.status.toLowerCase();
  const status =
    normalizedStatus === "confirmed" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "pending"
      ? normalizedStatus
      : "pending";

  return {
    id: booking.id,
    userId: booking.user_id,
    itineraryId: booking.itinerary_id ?? undefined,
    type: booking.type === "group" ? "group" : "personal",
    description: booking.description ?? undefined,
    status: status as "pending" | "confirmed" | "cancelled",
    date: booking.date,
    members: booking.members?.map(mapBookingMember),
    createdAt: booking.created_at,
  };
}

export function mapBookingMember(member: BackendBookingMember): BookingMember {
  return {
    id: member.id,
    bookingId: member.booking_id,
    name: member.name,
    email: member.email ?? undefined,
    phone: member.phone ?? undefined,
  };
}

export function mapBookingItem(item: BackendBookingItem): BookingItem {
  return {
    id: item.id,
    itineraryId: item.itinerary_id,
    bookingId: item.booking_id,
  };
}

class BookingsApiService extends BaseApiService<Booking, BackendBooking> {}
export const bookingsService = new BookingsApiService("/api/bookings", mapBooking);

export async function fetchBookings(token: string): Promise<Booking[]> {
  return bookingsService.getAll(token);
}

export async function createBooking(
  token: string,
  payload: CreateBookingPayload,
): Promise<Booking> {
  return bookingsService.create<CreateBookingPayload>({
    ...payload,
    type: payload.type ?? "personal",
  }, token);
}

export async function updateBooking(
  token: string,
  bookingId: string,
  payload: UpdateBookingPayload,
): Promise<Booking> {
  return bookingsService.update<UpdateBookingPayload>(bookingId, payload, token);
}

export async function deleteBooking(token: string, bookingId: string): Promise<void> {
  return bookingsService.delete(bookingId, token);
}

export async function fetchBookingItems(token: string): Promise<BookingItem[]> {
  const parsed = await requestHelper<BackendBookingItem[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/bookings/items`,
    token,
    headers: getAuthHeaders(token),
  });
  return parsed.data.map(mapBookingItem);
}

export async function createBookingItem(
  token: string,
  payload: CreateBookingItemPayload,
): Promise<BookingItem> {
  const parsed = await requestHelper<BackendBookingItem>({
    method: "POST",
    url: `${API_BASE_URL}/api/bookings/items`,
    token,
    headers: getAuthHeaders(token),
    data: payload,
  });
  return mapBookingItem(parsed.data);
}

export async function fetchBookingMembers(
  token: string,
  bookingId: string,
): Promise<BookingMember[]> {
  const parsed = await requestHelper<BackendBookingMember[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/bookings/${bookingId}/members`,
    token,
    headers: getAuthHeaders(token),
  });
  return parsed.data.map(mapBookingMember);
}

export async function createBookingMember(
  token: string,
  bookingId: string,
  payload: UpsertBookingMemberPayload,
): Promise<BookingMember> {
  const parsed = await requestHelper<BackendBookingMember>({
    method: "POST",
    url: `${API_BASE_URL}/api/bookings/${bookingId}/members`,
    token,
    headers: getAuthHeaders(token),
    data: payload,
  });
  return mapBookingMember(parsed.data);
}

export async function updateBookingMember(
  token: string,
  memberId: string,
  payload: UpsertBookingMemberPayload,
): Promise<BookingMember> {
  const parsed = await requestHelper<BackendBookingMember>({
    method: "PUT",
    url: `${API_BASE_URL}/api/bookings/members/${memberId}`,
    token,
    headers: getAuthHeaders(token),
    data: payload,
  });
  return mapBookingMember(parsed.data);
}

export async function deleteBookingMember(token: string, memberId: string): Promise<void> {
  await requestHelper<null>({
    method: "DELETE",
    url: `${API_BASE_URL}/api/bookings/members/${memberId}`,
    token,
    headers: getAuthHeaders(token),
  });
}
