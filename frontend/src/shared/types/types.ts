export type UserRole = "admin" | "company" | "user" | "visitor";

export type User = {
  id: string | number;
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  role: UserRole;
  roles?: UserRole[];
  accessStatus?: "active" | "inactive";
  createdAt?: string;
};

export type Company = {
  // Basic Info
  id: string | number;
  name: string;
  tagline?: string;
  description?: string;
  
  // Visual Branding
  logoUrl?: string;
  coverImageUrl?: string;
  
  // Location
  address?: string;
  city?: string;
  country?: string;
  
  // Contact Information
  email?: string;
  phone?: string;
  contact?: string; // Keep for backward compatibility
  
  // Business Details
  specializations?: string[];
  languages?: string[];
  
  // Operational
  operatingDays?: string;
  operatingHours?: string;
  
  // Online Presence
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  
  // Additional Info
  insuranceInfo?: string;
  emergencyPhone?: string;
  supportingDocs?: string[];
  
  // Metadata
  ownerId: string | number;
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "inactive";
};

export type Itinerary = {
  // Basic Information
  id: string | number;
  companyId: string | number;
  title: string;
  activity?: string;
  description?: string;
  location?: string;
  date: string; // ISO date string
  
  // Duration & Scheduling
  durationDays?: number;
  durationHours?: number;
  startTime?: string;
  endTime?: string;
  isMultiDay?: boolean;
  scheduleDetails?: string;
  
  // Capacity & Booking Policies
  minParticipants?: number;
  maxParticipants?: number;
  availableSlots?: number;
  allowsIndividuals?: boolean;
  allowsGroups?: boolean;
  groupDiscountPercent?: number;
  groupMinSize?: number;
  bookingDeadline?: string;
  
  // Inclusions & Exclusions
  inclusions?: string[];
  exclusions?: string[];
  providedEquipment?: string[];
  requiredItems?: string[];
  
  // Food & Meals
  mealsIncluded?: boolean;
  mealTypes?: string[];
  foodOptions?: string;
  canBuyFoodOnsite?: boolean;
  canBringOwnFood?: boolean;
  dietaryAccommodations?: string;
  
  // Transportation
  transportIncluded?: boolean;
  transportType?: string;
  pickupLocations?: string[];
  dropoffLocations?: string[];
  allowsOwnTransport?: boolean;
  parkingAvailable?: boolean;
  transportNotes?: string;
  
  // Meeting & Location Details
  meetingPoint?: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  endPoint?: string;
  endPointLat?: number;
  endPointLng?: number;
  locationDetails?: string;
  
  // Difficulty & Requirements
  difficultyLevel?: string;
  fitnessLevelRequired?: string;
  minAge?: number;
  maxAge?: number;
  ageRestrictionsNotes?: string;
  accessibilityInfo?: string;
  
  // Pricing & Payment
  price: number;
  pricePerPerson?: number;
  pricePerGroup?: number;
  depositRequired?: number;
  depositPercentage?: number;
  paymentMethods?: string[];
  currency?: string;
  refundPolicy?: string;
  cancellationPolicy?: string;
  
  // Safety & Insurance
  insuranceIncluded?: boolean;
  insuranceDetails?: string;
  safetyMeasures?: string[];
  emergencyProcedures?: string;
  medicalRequirements?: string;
  
  // Additional Information
  languagesOffered?: string[];
  guideInfo?: string;
  weatherDependency?: boolean;
  weatherNotes?: string;
  whatToWear?: string;
  additionalNotes?: string;
  termsAndConditions?: string;
  
  // Status & Visibility
  status?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: string[];
  category?: string;
  
  // Media
  imageUrl?: string;
  imageUrls?: string[];
  videoUrls?: string[];
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  lastBookingDate?: string;
  
  // Ratings (computed)
  averageRating?: number;
  totalRatings?: number;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type BookingType = "personal" | "group";

export type BookingMember = {
  id: string | number;
  bookingId: string | number;
  name: string;
  email?: string;
  phone?: string;
};

export type Booking = {
  id: string | number;
  userId: string | number;
  itineraryId?: string | number;
  type: BookingType;
  description?: string;
  status: BookingStatus;
  date: string; // ISO date string
  members?: BookingMember[];
  createdAt?: string;
};

export type ItineraryRating = {
  id: string | number;
  itineraryId: string | number;
  userId: string | number;
  rating: number; // 1-10
  title?: string;
  comment?: string;
  goodValue?: boolean;
  goodGuide?: boolean;
  wellOrganized?: boolean;
  safe?: boolean;
  wouldRecommend?: boolean;
  verifiedBooking?: boolean;
  bookingId?: string | number;
  createdAt?: string;
  updatedAt?: string;
  userName?: string; // For display purposes
};

export type CompanyRating = {
  id: string | number;
  companyId: string | number;
  userId: string | number;
  rating: number; // 1-10
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  userName?: string; // For display purposes
};

export type BookingItem = {
  id: string | number;
  itineraryId: string | number;
  bookingId: string | number;
};

