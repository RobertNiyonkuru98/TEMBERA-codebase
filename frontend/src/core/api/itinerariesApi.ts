import type { Itinerary } from "@/shared/types";
import { BaseApiService } from "./baseApi";
import { requestHelper } from "./requestHelper";
import { API_BASE_URL } from "./config";

export type BackendItinerary = {
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
  payment_methods?: string[] | null;
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

export type CreateItineraryPayload = {
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

export type UpdateItineraryPayload = Partial<Omit<CreateItineraryPayload, "company_id" | "images">>;

export function mapItinerary(itinerary: BackendItinerary): Itinerary {
  let imageUrls: string[] = [];
  
  if (itinerary.image_urls && itinerary.image_urls.length > 0) {
    imageUrls = itinerary.image_urls.map((url) => {
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      return url.startsWith("/") ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
    });
  } else if (itinerary.images && itinerary.images.length > 0) {
    imageUrls = (itinerary.images ?? [])
      .map((image) => {
        if (image.image_blob) return image.image_blob;
        if (image.image_url) {
          if (image.image_url.startsWith("http://") || image.image_url.startsWith("https://")) return image.image_url;
          return image.image_url.startsWith("/") ? `${API_BASE_URL}${image.image_url}` : `${API_BASE_URL}/${image.image_url}`;
        }
        return null;
      })
      .filter(Boolean) as string[];
  }

  let videoUrls: string[] = [];
  if (itinerary.video_urls && itinerary.video_urls.length > 0) {
    videoUrls = itinerary.video_urls.map((url) => {
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      return url.startsWith("/") ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
    });
  }

  return {
    id: itinerary.id,
    companyId: itinerary.company_id,
    title: itinerary.title,
    activity: itinerary.activity ?? undefined,
    description: itinerary.description ?? undefined,
    location: itinerary.location ?? undefined,
    date: itinerary.date,
    price: itinerary.price ?? 0,
    durationDays: itinerary.duration_days ?? undefined,
    durationHours: itinerary.duration_hours ?? undefined,
    startTime: itinerary.start_time ?? undefined,
    endTime: itinerary.end_time ?? undefined,
    isMultiDay: itinerary.is_multi_day ?? undefined,
    scheduleDetails: itinerary.schedule_details ?? undefined,
    minParticipants: itinerary.min_participants ?? undefined,
    maxParticipants: itinerary.max_participants ?? undefined,
    availableSlots: itinerary.available_slots ?? undefined,
    allowsIndividuals: itinerary.allows_individuals ?? undefined,
     allowsGroups: itinerary.allows_groups ?? undefined,
    groupDiscountPercent: itinerary.group_discount_percent ?? undefined,
    groupMinSize: itinerary.group_min_size ?? undefined,
    bookingDeadline: itinerary.booking_deadline ?? undefined,
    inclusions: itinerary.inclusions ?? undefined,
    exclusions: itinerary.exclusions ?? undefined,
    providedEquipment: itinerary.provided_equipment ?? undefined,
    requiredItems: itinerary.required_items ?? undefined,
    mealsIncluded: itinerary.meals_included ?? undefined,
    mealTypes: itinerary.meal_types ?? undefined,
    foodOptions: itinerary.food_options ?? undefined,
    canBuyFoodOnsite: itinerary.can_buy_food_onsite ?? undefined,
    canBringOwnFood: itinerary.can_bring_own_food ?? undefined,
    dietaryAccommodations: itinerary.dietary_accommodations ?? undefined,
    transportIncluded: itinerary.transport_included ?? undefined,
    transportType: itinerary.transport_type ?? undefined,
    pickupLocations: itinerary.pickup_locations ?? undefined,
    dropoffLocations: itinerary.dropoff_locations ?? undefined,
    allowsOwnTransport: itinerary.allows_own_transport ?? undefined,
    parkingAvailable: itinerary.parking_available ?? undefined,
    transportNotes: itinerary.transport_notes ?? undefined,
    meetingPoint: itinerary.meeting_point ?? undefined,
    meetingPointLat: itinerary.meeting_point_lat ?? undefined,
    meetingPointLng: itinerary.meeting_point_lng ?? undefined,
    endPoint: itinerary.end_point ?? undefined,
    endPointLat: itinerary.end_point_lat ?? undefined,
    endPointLng: itinerary.end_point_lng ?? undefined,
    locationDetails: itinerary.location_details ?? undefined,
    difficultyLevel: itinerary.difficulty_level ?? undefined,
    fitnessLevelRequired: itinerary.fitness_level_required ?? undefined,
    minAge: itinerary.min_age ?? undefined,
    maxAge: itinerary.max_age ?? undefined,
    ageRestrictionsNotes: itinerary.age_restrictions_notes ?? undefined,
    accessibilityInfo: itinerary.accessibility_info ?? undefined,
    pricePerPerson: itinerary.price_per_person ?? undefined,
    pricePerGroup: itinerary.price_per_group ?? undefined,
    depositRequired: itinerary.deposit_required ?? undefined,
    depositPercentage: itinerary.deposit_percentage ?? undefined,
    paymentMethods: itinerary.payment_methods ?? undefined,
    currency: itinerary.currency ?? undefined,
    refundPolicy: itinerary.refund_policy ?? undefined,
    cancellationPolicy: itinerary.cancellation_policy ?? undefined,
    insuranceIncluded: itinerary.insurance_included ?? undefined,
    insuranceDetails: itinerary.insurance_details ?? undefined,
    safetyMeasures: itinerary.safety_measures ?? undefined,
    emergencyProcedures: itinerary.emergency_procedures ?? undefined,
    medicalRequirements: itinerary.medical_requirements ?? undefined,
    languagesOffered: itinerary.languages_offered ?? undefined,
    guideInfo: itinerary.guide_info ?? undefined,
    weatherDependency: itinerary.weather_dependency ?? undefined,
    weatherNotes: itinerary.weather_notes ?? undefined,
    whatToWear: itinerary.what_to_wear ?? undefined,
    additionalNotes: itinerary.additional_notes ?? undefined,
    termsAndConditions: itinerary.terms_and_conditions ?? undefined,
    status: itinerary.status ?? undefined,
    isFeatured: itinerary.is_featured ?? undefined,
    isActive: itinerary.is_active ?? undefined,
    tags: itinerary.tags ?? undefined,
    category: itinerary.category ?? undefined,
    imageUrls,
    imageUrl: imageUrls[0],
    videoUrls,
    createdAt: itinerary.created_at,
    updatedAt: itinerary.updated_at,
    publishedAt: itinerary.published_at ?? undefined,
    lastBookingDate: itinerary.last_booking_date ?? undefined,
    averageRating: itinerary.average_rating ?? undefined,
    totalRatings: itinerary.total_ratings ?? undefined,
  };
}

class ItinerariesApiService extends BaseApiService<Itinerary, BackendItinerary> {}
export const itinerariesService = new ItinerariesApiService("/api/itineraries", mapItinerary);

export async function fetchItineraries(
  token: string,
  options?: { includeBlobs?: boolean },
): Promise<Itinerary[]> {
  const includeBlobs = options?.includeBlobs ?? false;
  return itinerariesService.getAll(token, includeBlobs ? "include_blobs=true" : "");
}

export async function fetchItineraryById(token: string, id: string): Promise<Itinerary> {
  return itinerariesService.getById(id, token);
}

export async function createItinerary(token: string, payload: CreateItineraryPayload): Promise<Itinerary> {
  const body: Partial<CreateItineraryPayload> = { ...payload };
  delete body.images;
  return itinerariesService.create(body, token);
}

export async function updateItinerary(token: string, itineraryId: string, data: UpdateItineraryPayload): Promise<Itinerary> {
  return itinerariesService.update(itineraryId, data, token);
}

export async function deleteItinerary(token: string, itineraryId: string): Promise<void> {
  return itinerariesService.delete(itineraryId, token);
}

export async function uploadItineraryImages(token: string, itineraryId: string, images: File[]): Promise<Itinerary> {
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

export async function hasCompanyItineraries(token: string, companyId: string): Promise<boolean> {
  const itineraries = await fetchItineraries(token);
  return itineraries.some((itinerary) => String(itinerary.companyId) === String(companyId));
}
