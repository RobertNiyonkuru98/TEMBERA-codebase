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
  id: string | number;
  companyId: string | number;
  title: string;
  activity?: string;
  description?: string;
  location?: string;
  date: string; // ISO date string
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
  createdAt?: string;
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

export type BookingItem = {
  id: string | number;
  itineraryId: string | number;
  bookingId: string | number;
};

