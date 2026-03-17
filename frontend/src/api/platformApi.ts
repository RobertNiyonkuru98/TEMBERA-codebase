import type {
  Booking,
  BookingItem,
  BookingMember,
  Company,
  Itinerary,
  User,
  UserRole,
} from "../types";
import { requestHelper } from "./requestHelper";

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
  images?: Array<{
    image_path: string;
    image_url?: string;
    image_blob?: string | null;
  }>;
  created_at?: string;
};

type BackendBooking = {
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

type BackendBookingMember = {
  id: string;
  booking_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

type BackendBookingItem = {
  id: string;
  itinerary_id: string;
  booking_id: string;
};

type CreateBookingPayload = {
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

type UpdateBookingPayload = {
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

type UpsertBookingMemberPayload = {
  name: string;
  email?: string;
  phone?: string;
};

type CreateBookingItemPayload = {
  booking_id: string;
  itinerary_id: string;
};

type CreateCompanyPayload = {
  name: string;
  description?: string;
  contact?: string;
  owner_id: string;
};

type CreateItineraryPayload = {
  company_id: string;
  title: string;
  activity?: string;
  description?: string;
  location?: string;
  date: string;
  price: number;
  images?: File[];
};

export type CompanyState = {
  hasCompany: boolean;
  companyId?: string;
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
  const imageUrls = (itinerary.images ?? [])
    .map((image) => {
      if (image.image_blob) return image.image_blob;
      if (image.image_url) return image.image_url;
      if (image.image_path.startsWith("http://") || image.image_path.startsWith("https://")) {
        return image.image_path;
      }
      if (image.image_path.startsWith("/")) {
        return `${API_BASE_URL}${image.image_path}`;
      }
      return `${API_BASE_URL}/${image.image_path}`;
    })
    .filter(Boolean);

  return {
    id: itinerary.id,
    companyId: itinerary.company_id,
    title: itinerary.title,
    activity: itinerary.activity ?? undefined,
    description: itinerary.description ?? undefined,
    location: itinerary.location ?? undefined,
    date: itinerary.date,
    price: itinerary.price,
    imageUrls,
    imageUrl: imageUrls[0],
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
    itineraryId: booking.itinerary_id ?? undefined,
    type: booking.type === "group" ? "group" : "personal",
    description: booking.description ?? undefined,
    status,
    date: booking.date,
    members: booking.members?.map(mapBookingMember),
    createdAt: booking.created_at,
  };
}

function mapBookingMember(member: BackendBookingMember): BookingMember {
  return {
    id: member.id,
    bookingId: member.booking_id,
    name: member.name,
    email: member.email ?? undefined,
    phone: member.phone ?? undefined,
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
  const parsed = await requestHelper<BackendUser[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/users`,
    token,
    headers: getAuthHeaders(token),
  });
  return parsed.data.map(mapUser);
}

export async function fetchCompanies(token: string): Promise<Company[]> {
  const parsed = await requestHelper<BackendCompany[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies`,
    token,
    headers: getAuthHeaders(token),
  });
  return parsed.data.map(mapCompany);
}

export async function fetchItineraries(
  token: string,
  options?: { includeBlobs?: boolean },
): Promise<Itinerary[]> {
  const includeBlobs = options?.includeBlobs ?? false;
  const parsed = await requestHelper<BackendItinerary[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/itineraries${includeBlobs ? "?include_blobs=true" : ""}`,
    token,
    headers: getAuthHeaders(token),
  });
  return parsed.data.map(mapItinerary);
}

export async function fetchItineraryById(
  token: string,
  id: string,
): Promise<Itinerary> {
  const parsed = await requestHelper<BackendItinerary>({
    method: "GET",
    url: `${API_BASE_URL}/api/itineraries/${id}`,
    token,
    headers: getAuthHeaders(token),
  });
  return mapItinerary(parsed.data);
}

export async function fetchBookings(token: string): Promise<Booking[]> {
  const parsed = await requestHelper<BackendBooking[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/bookings`,
    token,
    headers: getAuthHeaders(token),
  });
  return parsed.data.map(mapBooking);
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

export async function createBooking(
  token: string,
  payload: CreateBookingPayload,
): Promise<Booking> {
  const parsed = await requestHelper<BackendBooking>({
    method: "POST",
    url: `${API_BASE_URL}/api/bookings`,
    token,
    headers: getAuthHeaders(token),
    data: {
      ...payload,
      type: payload.type ?? "personal",
    },
  });
  return mapBooking(parsed.data);
}

export async function updateBooking(
  token: string,
  bookingId: string,
  payload: UpdateBookingPayload,
): Promise<Booking> {
  const parsed = await requestHelper<BackendBooking>({
    method: "PUT",
    url: `${API_BASE_URL}/api/bookings/${bookingId}`,
    token,
    headers: getAuthHeaders(token),
    data: payload,
  });

  return mapBooking(parsed.data);
}

export async function deleteBooking(token: string, bookingId: string): Promise<void> {
  await requestHelper<null>({
    method: "DELETE",
    url: `${API_BASE_URL}/api/bookings/${bookingId}`,
    token,
    headers: getAuthHeaders(token),
  });
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

export async function createCompany(
  token: string,
  payload: CreateCompanyPayload,
): Promise<Company> {
  const parsed = await requestHelper<BackendCompany>({
    method: "POST",
    url: `${API_BASE_URL}/api/companies`,
    token,
    headers: getAuthHeaders(token),
    data: payload,
  });
  return mapCompany(parsed.data);
}

export async function createItinerary(
  token: string,
  payload: CreateItineraryPayload,
): Promise<Itinerary> {
  const body = new FormData();
  body.append("company_id", payload.company_id);
  body.append("title", payload.title);
  body.append("date", payload.date);
  body.append("price", String(payload.price));

  if (payload.activity) body.append("activity", payload.activity);
  if (payload.description) body.append("description", payload.description);
  if (payload.location) body.append("location", payload.location);
  payload.images?.forEach((image) => body.append("images", image));

  const parsed = await requestHelper<BackendItinerary>({
    method: "POST",
    url: `${API_BASE_URL}/api/itineraries`,
    token,
    data: body,
  });
  return mapItinerary(parsed.data);
}

export async function uploadItineraryImages(
  token: string,
  itineraryId: string,
  images: File[],
): Promise<Itinerary> {
  const body = new FormData();
  images.forEach((image) => body.append("images", image));

  const parsed = await requestHelper<BackendItinerary>({
    method: "POST",
    url: `${API_BASE_URL}/api/itineraries/${itineraryId}/images`,
    token,
    data: body,
  });

  return mapItinerary(parsed.data);
}

export async function getMyCompanyState(
  token: string,
  userId: string,
): Promise<CompanyState> {
  const companies = await fetchCompanies(token);
  const company = companies.find(
    (item) => String(item.ownerId) === String(userId),
  );

  return company
    ? { hasCompany: true, companyId: String(company.id) }
    : { hasCompany: false };
}

export async function hasCompanyItineraries(
  token: string,
  companyId: string,
): Promise<boolean> {
  const itineraries = await fetchItineraries(token);
  return itineraries.some(
    (itinerary) => String(itinerary.companyId) === String(companyId),
  );
}
