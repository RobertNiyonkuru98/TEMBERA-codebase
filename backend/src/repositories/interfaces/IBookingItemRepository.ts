import { BookingItem, Prisma } from '@prisma/client';

export interface IBookingItemRepository {
  // Create
  create(data: Prisma.BookingItemCreateInput): Promise<BookingItem>;
  createMany(data: Prisma.BookingItemCreateManyInput[]): Promise<number>;

  // Read
  findById(id: bigint): Promise<BookingItem | null>;
  findByBookingId(bookingId: bigint): Promise<BookingItem[]>;
  findByItineraryId(itineraryId: bigint): Promise<BookingItem[]>;
  findByBookingAndItinerary(bookingId: bigint, itineraryId: bigint): Promise<BookingItem | null>;
  findAll(skip?: number, take?: number): Promise<BookingItem[]>;
  findWithItinerary(id: bigint): Promise<BookingItem | null>;
  findWithBooking(id: bigint): Promise<BookingItem | null>;

  // Update
  update(id: bigint, data: Prisma.BookingItemUpdateInput): Promise<BookingItem>;

  // Count
  count(): Promise<number>;
  countByBooking(bookingId: bigint): Promise<number>;
}
