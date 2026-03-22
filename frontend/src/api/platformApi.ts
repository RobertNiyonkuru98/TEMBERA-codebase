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
  // Basic Information
  id: string;
  company_id: string;
  title: string;
  activity?: string | null;
  description?: string | null;
  location?: string | null;
  date: string;
  price?: number | null;
  
  // Duration & Scheduling
  duration_days?: number | null;
  duration_hours?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  is_multi_day?: boolean;
  schedule_details?: string | null;
  
  // Capacity & Booking Policies
  min_participants?: number | null;
  max_participants?: number | null;
  available_slots?: number | null;
  allows_individuals?: boolean;
  allows_groups?: boolean;
  group_discount_percent?: number | null;
  group_min_size?: number | null;
  booking_deadline?: string | null;
  
  // Inclusions & Exclusions
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  provided_equipment?: string[] | null;
  required_items?: string[] | null;
  
  // Food & Meals
  meals_included?: boolean;
  meal_types?: string[] | null;
  food_options?: string | null;
  can_buy_food_onsite?: boolean;
  can_bring_own_food?: boolean;
  dietary_accommodations?: string | null;
  
  // Transportation
  transport_included?: boolean;
  transport_type?: string | null;
  pickup_locations?: string[] | null;
  dropoff_locations?: string[] | null;
  allows_own_transport?: boolean;
  parking_available?: boolean;
  transport_notes?: string | null;
  
  // Meeting & Location Details
  meeting_point?: string | null;
  meeting_point_lat?: number | null;
  meeting_point_lng?: number | null;
  end_point?: string | null;
  end_point_lat?: number | null;
  end_point_lng?: number | null;
  location_details?: string | null;
  
  // Difficulty & Requirements
  difficulty_level?: string | null;
  fitness_level_required?: string | null;
  min_age?: number | null;
  max_age?: number | null;
  age_restrictions_notes?: string | null;
  accessibility_info?: string | null;
  
  // Pricing & Payment
  price_per_person?: number | null;
  price_per_group?: number | null;
  deposit_required?: number | null;
  deposit_percentage?: number | null;
  payment_methods?: any[] | null;
  currency?: string | null;
  refund_policy?: string | null;
  cancellation_policy?: string | null;
  
  // Safety & Insurance
  insurance_included?: boolean;
  insurance_details?: string | null;
  safety_measures?: string[] | null;
  emergency_procedures?: string | null;
  medical_requirements?: string | null;
  
  // Additional Information
  languages_offered?: string[] | null;
  guide_info?: string | null;
  weather_dependency?: boolean;
  weather_notes?: string | null;
  what_to_wear?: string | null;
  additional_notes?: string | null;
  terms_and_conditions?: string | null;
  
  // Status & Visibility
  status?: string | null;
  is_featured?: boolean;
  is_active?: boolean;
  tags?: string[] | null;
  category?: string | null;
  
  // Media & Relations
  images?: Array<{
    id?: string;
    image_url: string;
    public_id: string;
    order?: number;
    image_blob?: string | null;
  }>;
  image_urls?: string[];
  image_blobs?: (string | null)[];
  videos?: Array<{
    id?: string;
    video_url: string;
    public_id: string;
    thumbnail_url?: string | null;
    order?: number;
  }>;
  video_urls?: string[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  last_booking_date?: string | null;
  
  // Ratings (computed)
  average_rating?: number | null;
  total_ratings?: number | null;
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
  // Basic Information
  company_id: string;
  title: string;
  activity?: string;
  description?: string;
  location?: string;
  date: string;
  price: number;
  
  // Duration & Scheduling
  duration_days?: number;
  duration_hours?: number;
  start_time?: string;
  end_time?: string;
  is_multi_day?: boolean;
  schedule_details?: string;
  
  // Capacity & Booking Policies
  min_participants?: number;
  max_participants?: number;
  available_slots?: number;
  allows_individuals?: boolean;
  allows_groups?: boolean;
  group_discount_percent?: number;
  group_min_size?: number;
  booking_deadline?: string;
  
  // Inclusions & Exclusions
  inclusions?: string[];
  exclusions?: string[];
  provided_equipment?: string[];
  required_items?: string[];
  
  // Food & Meals
  meals_included?: boolean;
  meal_types?: string[];
  food_options?: string;
  can_buy_food_onsite?: boolean;
  can_bring_own_food?: boolean;
  dietary_accommodations?: string;
  
  // Transportation
  transport_included?: boolean;
  transport_type?: string;
  pickup_locations?: string[];
  dropoff_locations?: string[];
  allows_own_transport?: boolean;
  parking_available?: boolean;
  transport_notes?: string;
  
  // Meeting & Location Details
  meeting_point?: string;
  meeting_point_lat?: number | null;
  meeting_point_lng?: number | null;
  end_point?: string;
  end_point_lat?: number | null;
  end_point_lng?: number | null;
  location_details?: string;
  
  // Difficulty & Requirements
  difficulty_level?: string;
  fitness_level_required?: string;
  min_age?: number;
  max_age?: number;
  age_restrictions_notes?: string;
  accessibility_info?: string;
  
  // Pricing & Payment
  price_per_person?: number;
  price_per_group?: number;
  deposit_required?: number;
  deposit_percentage?: number;
  payment_methods?: string[];
  currency?: string;
  refund_policy?: string;
  cancellation_policy?: string;
  
  // Safety & Insurance
  insurance_included?: boolean;
  insurance_details?: string;
  safety_measures?: string[];
  emergency_procedures?: string;
  medical_requirements?: string;
  
  // Additional Information
  languages_offered?: string[];
  guide_info?: string;
  weather_dependency?: boolean;
  weather_notes?: string;
  what_to_wear?: string;
  additional_notes?: string;
  terms_and_conditions?: string;
  
  // Status & Visibility
  status?: string;
  is_featured?: boolean;
  is_active?: boolean;
  tags?: string[];
  category?: string;
  
  // Media
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

  // Handle video URLs
  let videoUrls: string[] = [];
  if (itinerary.video_urls && itinerary.video_urls.length > 0) {
    videoUrls = itinerary.video_urls.map((url) => {
      // If it's already a full URL (Cloudinary), return as-is
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      // If it's a local path, prepend API base URL
      const fullUrl = url.startsWith("/") ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
      return fullUrl;
    });
  }

  const result: Itinerary = {
    // Basic Information
    id: itinerary.id,
    companyId: itinerary.company_id,
    title: itinerary.title,
    activity: itinerary.activity ?? undefined,
    description: itinerary.description ?? undefined,
    location: itinerary.location ?? undefined,
    date: itinerary.date,
    price: itinerary.price ?? 0, // Default to 0 if null
    
    // Duration & Scheduling
    durationDays: itinerary.duration_days ?? undefined,
    durationHours: itinerary.duration_hours ?? undefined,
    startTime: itinerary.start_time ?? undefined,
    endTime: itinerary.end_time ?? undefined,
    isMultiDay: itinerary.is_multi_day ?? undefined,
    scheduleDetails: itinerary.schedule_details ?? undefined,
    
    // Capacity & Booking Policies
    minParticipants: itinerary.min_participants ?? undefined,
    maxParticipants: itinerary.max_participants ?? undefined,
    availableSlots: itinerary.available_slots ?? undefined,
    allowsIndividuals: itinerary.allows_individuals ?? undefined,
    allowsGroups: itinerary.allows_groups ?? undefined,
    groupDiscountPercent: itinerary.group_discount_percent ?? undefined,
    groupMinSize: itinerary.group_min_size ?? undefined,
    bookingDeadline: itinerary.booking_deadline ?? undefined,
    
    // Inclusions & Exclusions
    inclusions: itinerary.inclusions ?? undefined,
    exclusions: itinerary.exclusions ?? undefined,
    providedEquipment: itinerary.provided_equipment ?? undefined,
    requiredItems: itinerary.required_items ?? undefined,
    
    // Food & Meals
    mealsIncluded: itinerary.meals_included ?? undefined,
    mealTypes: itinerary.meal_types ?? undefined,
    foodOptions: itinerary.food_options ?? undefined,
    canBuyFoodOnsite: itinerary.can_buy_food_onsite ?? undefined,
    canBringOwnFood: itinerary.can_bring_own_food ?? undefined,
    dietaryAccommodations: itinerary.dietary_accommodations ?? undefined,
    
    // Transportation
    transportIncluded: itinerary.transport_included ?? undefined,
    transportType: itinerary.transport_type ?? undefined,
    pickupLocations: itinerary.pickup_locations ?? undefined,
    dropoffLocations: itinerary.dropoff_locations ?? undefined,
    allowsOwnTransport: itinerary.allows_own_transport ?? undefined,
    parkingAvailable: itinerary.parking_available ?? undefined,
    transportNotes: itinerary.transport_notes ?? undefined,
    
    // Meeting & Location Details
    meetingPoint: itinerary.meeting_point ?? undefined,
    meetingPointLat: itinerary.meeting_point_lat ?? undefined,
    meetingPointLng: itinerary.meeting_point_lng ?? undefined,
    endPoint: itinerary.end_point ?? undefined,
    endPointLat: itinerary.end_point_lat ?? undefined,
    endPointLng: itinerary.end_point_lng ?? undefined,
    locationDetails: itinerary.location_details ?? undefined,
    
    // Difficulty & Requirements
    difficultyLevel: itinerary.difficulty_level ?? undefined,
    fitnessLevelRequired: itinerary.fitness_level_required ?? undefined,
    minAge: itinerary.min_age ?? undefined,
    maxAge: itinerary.max_age ?? undefined,
    ageRestrictionsNotes: itinerary.age_restrictions_notes ?? undefined,
    accessibilityInfo: itinerary.accessibility_info ?? undefined,
    
    // Pricing & Payment
    pricePerPerson: itinerary.price_per_person ?? undefined,
    pricePerGroup: itinerary.price_per_group ?? undefined,
    depositRequired: itinerary.deposit_required ?? undefined,
    depositPercentage: itinerary.deposit_percentage ?? undefined,
    paymentMethods: itinerary.payment_methods ?? undefined,
    currency: itinerary.currency ?? undefined,
    refundPolicy: itinerary.refund_policy ?? undefined,
    cancellationPolicy: itinerary.cancellation_policy ?? undefined,
    
    // Safety & Insurance
    insuranceIncluded: itinerary.insurance_included ?? undefined,
    insuranceDetails: itinerary.insurance_details ?? undefined,
    safetyMeasures: itinerary.safety_measures ?? undefined,
    emergencyProcedures: itinerary.emergency_procedures ?? undefined,
    medicalRequirements: itinerary.medical_requirements ?? undefined,
    
    // Additional Information
    languagesOffered: itinerary.languages_offered ?? undefined,
    guideInfo: itinerary.guide_info ?? undefined,
    weatherDependency: itinerary.weather_dependency ?? undefined,
    weatherNotes: itinerary.weather_notes ?? undefined,
    whatToWear: itinerary.what_to_wear ?? undefined,
    additionalNotes: itinerary.additional_notes ?? undefined,
    termsAndConditions: itinerary.terms_and_conditions ?? undefined,
    
    // Status & Visibility
    status: itinerary.status ?? undefined,
    isFeatured: itinerary.is_featured ?? undefined,
    isActive: itinerary.is_active ?? undefined,
    tags: itinerary.tags ?? undefined,
    category: itinerary.category ?? undefined,
    
    // Media
    imageUrls,
    imageUrl: imageUrls[0],
    videoUrls,
    
    // Timestamps
    createdAt: itinerary.created_at,
    updatedAt: itinerary.updated_at,
    publishedAt: itinerary.published_at ?? undefined,
    lastBookingDate: itinerary.last_booking_date ?? undefined,
    
    // Ratings (computed)
    averageRating: itinerary.average_rating ?? undefined,
    totalRatings: itinerary.total_ratings ?? undefined,
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
  const mapped = mapItinerary(parsed.data);
  
  return mapped;
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

export async function fetchCompanyById(
  token: string,
  companyId: string,
): Promise<Company> {
  const parsed = await requestHelper<BackendCompany>({
    method: "GET",
    url: `${API_BASE_URL}/api/companies/${companyId}`,
    token,
    headers: getAuthHeaders(token),
  });
  return mapCompany(parsed.data);
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

export async function deleteCompany(
  token: string,
  companyId: string,
): Promise<void> {
  await requestHelper<null>({
    method: "DELETE",
    url: `${API_BASE_URL}/api/companies/${companyId}`,
    token,
    headers: getAuthHeaders(token),
  });
}

export async function createItinerary(
  token: string,
  payload: CreateItineraryPayload,
): Promise<Itinerary> {
  // Omit files from JSON body if present
  const body: any = { ...payload };
  delete body.images;

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
