import type { Booking, BookingItem, Company, Itinerary, User, UserRole } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  resp_code: number;
  data: T;
};

type BackendUser = {
  id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  role?: UserRole;
  created_at?: string;
  roles?: { access_level: UserRole; access_status: string }[];
};

type BackendCompany = {
  id: string;
  name: string;
  description?: string | null;
  contact?: string | null;
  owner_id: string;
  created_at?: string;
};

type BackendItinerary = {
  id: string;
  company_id: string;
  title: string;
  activity?: string | null;
  description?: string | null;
  location?: string | null;
  date: string;
  price: number;
  created_at?: string;
};

type BackendBooking = {
  id: string;
  user_id: string;
  description?: string | null;
  status: string;
  date: string;
  created_at?: string;
};

type BackendBookingItem = {
  id: string;
  itinerary_id: string;
  booking_id: string;
};

type CreateBookingPayload = {
  user_id: string;
  description?: string;
  status: string;
  date: string;
};

type CreateBookingItemPayload = {
  booking_id: string;
  itinerary_id: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function resolveUserRole(email: string, rawRole?: string): UserRole {
  if (
    rawRole === "admin" ||
    rawRole === "company" ||
    rawRole === "user" ||
    rawRole === "visitor"
  ) {
    return rawRole;
  }

  const normalizedEmail = email.toLowerCase();
  if (normalizedEmail.includes("admin")) return "admin";
  if (normalizedEmail.includes("company")) return "company";
  if (normalizedEmail.includes("visitor")) return "visitor";
  return "user";
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const parsed = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !parsed.success) {
    throw new Error(parsed.message || "Request failed");
  }
  return parsed;
}

function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function mapUser(user: BackendUser): User {
  const activeRole = user.roles?.find((role) => role.access_status === "active");
  const accessStatus = user.roles?.some((role) => role.access_status === "active")
    ? "active"
    : "inactive";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phone_number ?? undefined,
    role: resolveUserRole(user.email, user.role ?? activeRole?.access_level),
    accessStatus,
    createdAt: user.created_at,
  };
}

function mapCompany(company: BackendCompany): Company {
  return {
    id: company.id,
    name: company.name,
    description: company.description ?? undefined,
    contact: company.contact ?? undefined,
    ownerId: company.owner_id,
    createdAt: company.created_at,
    status: "active",
  };
}

function mapItinerary(itinerary: BackendItinerary): Itinerary {
  return {
    id: itinerary.id,
    companyId: itinerary.company_id,
    title: itinerary.title,
    activity: itinerary.activity ?? undefined,
    description: itinerary.description ?? undefined,
    location: itinerary.location ?? undefined,
    date: itinerary.date,
    price: itinerary.price,
    createdAt: itinerary.created_at,
  };
}

function mapBooking(booking: BackendBooking): Booking {
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
    description: booking.description ?? undefined,
    status,
    date: booking.date,
    createdAt: booking.created_at,
  };
}

function mapBookingItem(item: BackendBookingItem): BookingItem {
  return {
    id: item.id,
    itineraryId: item.itinerary_id,
    bookingId: item.booking_id,
  };
}

export async function fetchUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    headers: getAuthHeaders(token),
  });
  const parsed = await parseResponse<BackendUser[]>(response);
  return parsed.data.map(mapUser);
}

export async function fetchCompanies(token: string): Promise<Company[]> {
  const response = await fetch(`${API_BASE_URL}/api/companies`, {
    headers: getAuthHeaders(token),
  });
  const parsed = await parseResponse<BackendCompany[]>(response);
  return parsed.data.map(mapCompany);
}

export async function fetchItineraries(token: string): Promise<Itinerary[]> {
  const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
    headers: getAuthHeaders(token),
  });
  const parsed = await parseResponse<BackendItinerary[]>(response);
  return parsed.data.map(mapItinerary);
}

export async function fetchItineraryById(
  token: string,
  id: string,
): Promise<Itinerary> {
  const response = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
    headers: getAuthHeaders(token),
  });
  const parsed = await parseResponse<BackendItinerary>(response);
  return mapItinerary(parsed.data);
}

export async function fetchBookings(token: string): Promise<Booking[]> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    headers: getAuthHeaders(token),
  });
  const parsed = await parseResponse<BackendBooking[]>(response);
  return parsed.data.map(mapBooking);
}

export async function fetchBookingItems(token: string): Promise<BookingItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/bookings/items`, {
    headers: getAuthHeaders(token),
  });
  const parsed = await parseResponse<BackendBookingItem[]>(response);
  return parsed.data.map(mapBookingItem);
}

export async function createBooking(
  token: string,
  payload: CreateBookingPayload,
): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  const parsed = await parseResponse<BackendBooking>(response);
  return mapBooking(parsed.data);
}

export async function createBookingItem(
  token: string,
  payload: CreateBookingItemPayload,
): Promise<BookingItem> {
  const response = await fetch(`${API_BASE_URL}/api/bookings/items`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  const parsed = await parseResponse<BackendBookingItem>(response);
  return mapBookingItem(parsed.data);
}
