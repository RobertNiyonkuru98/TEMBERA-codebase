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
  createdAt?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string | number;
  userId: string | number;
  description?: string;
  status: BookingStatus;
  date: string; // ISO date string
  createdAt?: string;
};

export type BookingItem = {
  id: string | number;
  itineraryId: string | number;
  bookingId: string | number;
};

