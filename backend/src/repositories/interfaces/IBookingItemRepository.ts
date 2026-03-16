import { BookingItem, Prisma } from '@prisma/client';

export interface IBookingItemRepository {
  // Create
  create(data: Prisma.BookingItemCreateInput): Promise<BookingItem>;
  createMany(data: Prisma.BookingItemCreateManyInput[]): Promise<number>;

  // Read
  findById(id: string): Promise<BookingItem | null>;
  findByBookingId(bookingId: string): Promise<BookingItem[]>;
  findByItineraryId(itineraryId: string): Promise<BookingItem[]>;
  findByBookingAndItinerary(bookingId: string, itineraryId: string): Promise<BookingItem | null>;
  findAll(skip?: number, take?: number): Promise<BookingItem[]>;
  findWithItinerary(id: string): Promise<BookingItem | null>;
  findWithBooking(id: string): Promise<BookingItem | null>;

  // Update
  update(id: string, data: Prisma.BookingItemUpdateInput): Promise<BookingItem>;

  // Delete
  delete(id: string): Promise<void>;

  // Count
  count(): Promise<number>;
  countByBooking(bookingId: string): Promise<number>;
}
