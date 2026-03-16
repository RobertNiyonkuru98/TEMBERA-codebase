export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
};

export type Company = {
  id: number;
  name: string;
  description?: string;
  contact?: string;
  ownerId: number;
};

export type Itinerary = {
  id: number;
  companyId: number;
  title: string;
  activity?: string;
  description?: string;
  location?: string;
  date: string; // ISO date string
  price: number;
  imageUrl?: string;
};

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: number;
  userId: number;
  description?: string;
  status: BookingStatus;
  date: string; // ISO date string
};

export type BookingItem = {
  id: number;
  itineraryId: number;
  bookingId: number;
};

