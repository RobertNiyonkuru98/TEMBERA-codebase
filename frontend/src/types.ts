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
  id: string | number;
  name: string;
  description?: string;
  contact?: string;
  ownerId: string | number;
  createdAt?: string;
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

