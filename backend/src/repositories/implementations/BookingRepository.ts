import { Booking, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { IBookingRepository } from '../interfaces/IBookingRepository';

export class BookingRepository implements IBookingRepository {
  // Create
  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    return await prisma.booking.create({ data });
  }

  // Read
  async findById(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { user_id: userId },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByStatus(status: string): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: { status },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findAll(skip?: number, take?: number): Promise<Booking[]> {
    return await prisma.booking.findMany({
      skip,
      take,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findWithUser(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async findWithItems(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async findComplete(id: string): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            itinerary: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });
  }

  // Update
  async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: string): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  // Delete
  async delete(id: string): Promise<void> {
    await prisma.booking.delete({ where: { id } });
  }

  // Count
  async count(): Promise<number> {
    return await prisma.booking.count();
  }

  async countByStatus(status: string): Promise<number> {
    return await prisma.booking.count({
      where: { status },
    });
  }
}
