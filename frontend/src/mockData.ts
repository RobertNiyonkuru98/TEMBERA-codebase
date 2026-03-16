import type { Booking, BookingItem, Company, Itinerary, User } from "./types";

export const users: User[] = [
  {
    id: 1,
    name: "Alice Traveler",
    email: "alice@example.com",
    phoneNumber: "+250 781 234 567",
    password: "Password123!",
    role: "user",
  },
  {
    id: 2,
    name: "Celine Company",
    email: "company@example.com",
    password: "Password123!",
    role: "company",
  },
  {
    id: 3,
    name: "Aline Admin",
    email: "admin@example.com",
    password: "Password123!",
    role: "admin",
  },
  {
    id: 4,
    name: "Victor Visitor",
    email: "visitor@example.com",
    password: "Password123!",
    role: "visitor",
  },
];

export const companies: Company[] = [
  {
    id: 1,
    name: "Kigali Adventures",
    description: "City tours and cultural experiences around Kigali.",
    contact: "+250 781 000 111",
    ownerId: 1,
  },
  {
    id: 2,
    name: "Lake Kivu Getaways",
    description: "Relaxing weekend trips by Lake Kivu.",
    contact: "+250 781 000 222",
    ownerId: 2,
  },
];

export const itineraries: Itinerary[] = [
  {
    id: 1,
    companyId: 1,
    title: "Kigali City Tour",
    activity: "City tour",
    description: "Half-day guided tour through Kigali landmarks and markets.",
    location: "Kigali, Rwanda",
    date: "2026-04-01",
    price: 40000,
    imageUrl: "https://www.akageranationalparkrwanda.org/wp-content/uploads/2022/04/d1d38124-c2a6-4b1a-963e-54ef8600bb53.jpg"
  },
  {
    id: 2,
    companyId: 1,
    title: "Hiking Mount Kigali",
    activity: "Hiking",
    description: "Morning hike with panoramic views of Kigali.",
    location: "Mount Kigali, Rwanda",
    date: "2026-04-05",
    price: 30000,
    imageUrl: "https://www.volcanoesparkrwanda.org/wp-content/uploads/2021/10/0d-720x450.jpg"
  },
  {
    id: 3,
    companyId: 2,
    title: "Weekend at Lake Kivu",
    activity: "Getaway",
    description: "Two-night stay with boat ride and beachfront dinner.",
    location: "Gisenyi, Rwanda",
    date: "2026-04-10",
    price: 250000,
    imageUrl: "https://www.safarisrwandasafari.com/wp-content/uploads/2023/03/lake-kivu-rwanda-750x450.jpg"
  },
];

export const bookings: Booking[] = [
  {
    id: 10,
    userId: 1,
    description: "Easter weekend plans",
    status: "confirmed",
    date: "2026-03-20",
  },
  {
    id: 11,
    userId: 1,
    status: "pending",
    date: "2026-03-25",
  },
];

export const bookingItems: BookingItem[] = [
  {
    id: 1,
    bookingId: 10,
    itineraryId: 1,
  },
  {
    id: 2,
    bookingId: 10,
    itineraryId: 3,
  },
  {
    id: 3,
    bookingId: 11,
    itineraryId: 2,
  },
];

