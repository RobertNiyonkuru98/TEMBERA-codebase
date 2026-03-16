import { BookingItem, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { IBookingItemRepository } from '../interfaces/IBookingItemRepository';

export class BookingItemRepository implements IBookingItemRepository {
  // Create
  async create(data: Prisma.BookingItemCreateInput): Promise<BookingItem> {
    return await prisma.bookingItem.create({ data });
  }

  async createMany(data: Prisma.BookingItemCreateManyInput[]): Promise<number> {
    const result = await prisma.bookingItem.createMany({
      data,
      skipDuplicates: true,
    });
    return result.count;
  }

  // Read
  async findById(id: string): Promise<BookingItem | null> {
    return await prisma.bookingItem.findUnique({
      where: { id },
    });
  }

  async findByBookingId(bookingId: string): Promise<BookingItem[]> {
    return await prisma.bookingItem.findMany({
      where: { booking_id: bookingId },
      include: {
        itinerary: true,
      },
    });
  }

  async findByItineraryId(itineraryId: string): Promise<BookingItem[]> {
    return await prisma.bookingItem.findMany({
      where: { itinerary_id: itineraryId },
      include: {
        booking: true,
      },
    });
  }

  async findByBookingAndItinerary(
    bookingId: string,
    itineraryId: string
  ): Promise<BookingItem | null> {
    return await prisma.bookingItem.findUnique({
      where: {
        booking_id_itinerary_id: {
          booking_id: bookingId,
          itinerary_id: itineraryId,
        },
      },
    });
  }

  async findAll(skip?: number, take?: number): Promise<BookingItem[]> {
    return await prisma.bookingItem.findMany({
      skip,
      take,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findWithItinerary(id: string): Promise<BookingItem | null> {
    return await prisma.bookingItem.findUnique({
      where: { id },
      include: {
        itinerary: true,
      },
    });
  }

  async findWithBooking(id: string): Promise<BookingItem | null> {
    return await prisma.bookingItem.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    });
  }

  // Update
  async update(id: string, data: Prisma.BookingItemUpdateInput): Promise<BookingItem> {
    return await prisma.bookingItem.update({
      where: { id },
      data,
    });
  }

  // Count
  async count(): Promise<number> {
    return await prisma.bookingItem.count();
  }

  async countByBooking(bookingId: string): Promise<number> {
    return await prisma.bookingItem.count({
      where: { booking_id: bookingId },
    });
  }
}
