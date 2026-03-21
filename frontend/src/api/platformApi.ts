/* eslint-disable @typescript-eslint/no-explicit-any */
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
  // Basic Info
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  
  // Visual Branding
  logo_url?: string | null;
  cover_image_url?: string | null;
  
  // Location
  address?: string | null;
  city?: string | null;
  country?: string | null;
  
  // Contact Information
  email?: string | null;
  phone?: string | null;
  contact?: string | null;
  
  // Business Details
  specializations?: string[] | null;
  languages?: string[] | null;
  
  // Operational
  operating_days?: string | null;
  operating_hours?: string | null;
  
  // Online Presence
  website?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  
  // Additional Info
  insurance_info?: string | null;
  emergency_phone?: string | null;
  supporting_docs?: string[] | null;
  
  // Metadata
  owner_id: string;
  created_at?: string;
  updated_at?: string;
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
    id?: string;
    image_url: string;
    public_id: string;
    order?: number;
    image_blob?: string | null;
  }>;
  image_urls?: string[];
  image_blobs?: (string | null)[];
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
  // Basic Info
  name: string;
  tagline?: string;
  description?: string;
  
  // Visual Branding
  logo_url?: string;
  cover_image_url?: string;
  
  // Location
  address?: string;
  city?: string;
  country?: string;
  
  // Contact Information
  email?: string;
  phone?: string;
  contact?: string;
  
  // Business Details
  specializations?: string[];
  languages?: string[];
  
  // Operational
  operating_days?: string;
  operating_hours?: string;
  
  // Online Presence
  website?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  
  // Additional Info
  insurance_info?: string;
  emergency_phone?: string;
  supporting_docs?: string[];
  
  // Required
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
  imageUrls?: string[];
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
    // Basic Info
    id: company.id,
    name: company.name,
    tagline: company.tagline ?? undefined,
    description: company.description ?? undefined,
    
    // Visual Branding
    logoUrl: company.logo_url ?? undefined,
    coverImageUrl: company.cover_image_url ?? undefined,
    
    // Location
    address: company.address ?? undefined,
    city: company.city ?? undefined,
    country: company.country ?? undefined,
    
    // Contact Information
    email: company.email ?? undefined,
    phone: company.phone ?? undefined,
    contact: company.contact ?? undefined,
    
    // Business Details
    specializations: company.specializations ?? undefined,
    languages: company.languages ?? undefined,
    
    // Operational
    operatingDays: company.operating_days ?? undefined,
    operatingHours: company.operating_hours ?? undefined,
    
    // Online Presence
    website: company.website ?? undefined,
    facebookUrl: company.facebook_url ?? undefined,
    instagramUrl: company.instagram_url ?? undefined,
    twitterUrl: company.twitter_url ?? undefined,
    
    // Additional Info
    insuranceInfo: company.insurance_info ?? undefined,
    emergencyPhone: company.emergency_phone ?? undefined,
    supportingDocs: company.supporting_docs ?? undefined,
    
    // Metadata
    ownerId: company.owner_id,
    createdAt: company.created_at,
    updatedAt: company.updated_at,
  };
}

function mapItinerary(itinerary: BackendItinerary): Itinerary {
  // Use image_urls array from backend if available, otherwise map from images
  let imageUrls: string[] = [];
  
  if (itinerary.image_urls && itinerary.image_urls.length > 0) {
    // Backend provides image_urls array - use it directly
    imageUrls = itinerary.image_urls.map((url) => {
      // If it's already a full URL (Cloudinary), return as-is
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      // If it's a local path, prepend API base URL
      const fullUrl = url.startsWith("/") ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
      return fullUrl;
    });
  } else if (itinerary.images && itinerary.images.length > 0) {
    // Fallback: map from images array
    imageUrls = (itinerary.images ?? [])
      .map((image) => {
        if (image.image_blob) return image.image_blob;
        if (image.image_url) {
          // If it's already a full URL (Cloudinary), return as-is
          if (image.image_url.startsWith("http://") || image.image_url.startsWith("https://")) {
            return image.image_url;
          }
          // If it's a local path, prepend API base URL
          if (image.image_url.startsWith("/")) {
            return `${API_BASE_URL}${image.image_url}`;
          }
          return `${API_BASE_URL}/${image.image_url}`;
        }
        return null;
      })
      .filter(Boolean) as string[];
  }

  const result = {
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
  return result;
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
  // Build JSON body
  const body: any = {
    company_id: payload.company_id,
    title: payload.title,
    date: payload.date,
    price: payload.price,
  };

  if (payload.activity) body.activity = payload.activity;
  if (payload.description) body.description = payload.description;
  if (payload.location) body.location = payload.location;
  if (payload.imageUrls) body.imageUrls = payload.imageUrls;

  // Send request as JSON
  const parsed = await requestHelper<BackendItinerary>({
    method: "POST",
    url: `${API_BASE_URL}/api/itineraries`,
    token,
    data: body,
    headers: {
      "Content-Type": "application/json",
    },
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

// ============================================
// Company Rating API Functions
// ============================================

export type CompanyRating = {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
};

type BackendCompanyRating = {
  id: string;
  rating: number;
  comment?: string | null;
  user_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
    logo_url?: string | null;
  };
};

function mapCompanyRating(rating: BackendCompanyRating): CompanyRating {
  return {
    id: rating.id,
    rating: rating.rating,
    comment: rating.comment || undefined,
    userId: rating.user_id,
    companyId: rating.company_id,
    createdAt: rating.created_at,
    updatedAt: rating.updated_at,
    user: rating.user,
    company: rating.company ? {
      id: rating.company.id,
      name: rating.company.name,
      logoUrl: rating.company.logo_url || undefined,
    } : undefined,
  };
}

export async function createOrUpdateCompanyRating(
  token: string,
  companyId: string,
  rating: number,
  comment?: string,
): Promise<CompanyRating> {
  const parsed = await requestHelper<BackendCompanyRating>({
    method: "POST",
    url: `${API_BASE_URL}/api/companies/${companyId}/ratings`,
    token,
    data: { rating, comment },
  });
  return mapCompanyRating(parsed.data);
}

export async function getCompanyRatings(companyId: string): Promise<CompanyRating[]> {
  const parsed = await requestHelper<BackendCompanyRating[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies/${companyId}/ratings`,
  });
  return parsed.data.map(mapCompanyRating);
}

export async function getCompanyRatingStats(companyId: string): Promise<{
  average: number;
  count: number;
  ratings: CompanyRating[];
}> {
  const parsed = await requestHelper<{
    average: number;
    count: number;
    ratings: BackendCompanyRating[];
  }>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies/${companyId}/ratings/stats`,
  });
  return {
    average: parsed.data.average,
    count: parsed.data.count,
    ratings: parsed.data.ratings.map(mapCompanyRating),
  };
}

export async function getUserRatingForCompany(
  token: string,
  companyId: string,
): Promise<CompanyRating | null> {
  try {
    const parsed = await requestHelper<BackendCompanyRating | null>({
      method: "GET",
      url: `${API_BASE_URL}/api/companies/${companyId}/ratings/me`,
      token,
    });
    return parsed.data ? mapCompanyRating(parsed.data) : null;
  } catch {
    return null;
  }
}

export async function getUserRatings(token: string): Promise<CompanyRating[]> {
  const parsed = await requestHelper<BackendCompanyRating[]>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies/ratings/me`,
    token,
  });
  return parsed.data.map(mapCompanyRating);
}

export async function deleteCompanyRating(
  token: string,
  ratingId: string,
): Promise<void> {
  await requestHelper({
    method: "DELETE",
    url: `${API_BASE_URL}/api/companies/ratings/${ratingId}`,
    token,
  });
}
