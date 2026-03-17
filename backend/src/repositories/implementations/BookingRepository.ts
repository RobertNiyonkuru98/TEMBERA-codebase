import { Booking, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import {
  BookingCreatePayload,
  BookingUpdatePayload,
  BookingWithRelations,
  IBookingRepository,
} from '../interfaces/IBookingRepository';

export class BookingRepository implements IBookingRepository {
  private readonly bookingInclude = {
    user: true,
    itinerary: true,
    members: true,
    items: {
      include: {
        itinerary: {
          include: {
            company: true,
          },
        },
      },
    },
  } as const;

  // BookingItem methods
  async findAllItems(skip?: number, take?: number) {
    return await prisma.bookingItem.findMany({ skip, take, orderBy: { id: 'desc' } });
  }

  async findItemById(id: string) {
    return await prisma.bookingItem.findUnique({ where: { id } });
  }

  async createItem(data: Prisma.BookingItemCreateInput) {
    return await prisma.bookingItem.create({ data });
  }

  async updateItem(id: string, data: Prisma.BookingItemUpdateInput) {
    return await prisma.bookingItem.update({ where: { id }, data });
  }

  async deleteItem(id: string) {
    await prisma.bookingItem.delete({ where: { id } });
  }

  async findMembersByBookingId(bookingId: string) {
    return await prisma.bookingMember.findMany({
      where: { booking_id: bookingId },
      orderBy: { id: 'asc' },
    });
  }

  async createMember(bookingId: string, data: { name: string; email?: string; phone?: string }) {
    return await prisma.bookingMember.create({
      data: {
        booking_id: bookingId,
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  async updateMember(id: string, data: { name: string; email?: string; phone?: string }) {
    return await prisma.bookingMember.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  async deleteMember(id: string) {
    await prisma.bookingMember.delete({ where: { id } });
  }

  // Create
  async create(data: BookingCreatePayload): Promise<BookingWithRelations> {
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          user_id: data.user_id,
          itinerary_id: data.itineraryId,
          type: data.type,
          description: data.description,
          status: data.status,
          date: data.date,
        },
      });

      if (data.itineraryId) {
        await tx.bookingItem.create({
          data: {
            booking_id: booking.id,
            itinerary_id: data.itineraryId,
          },
        });
      }

      if (data.type === 'group' && data.members?.length) {
        await tx.bookingMember.createMany({
          data: data.members.map((member) => ({
            booking_id: booking.id,
            name: member.name,
            email: member.email,
            phone: member.phone,
          })),
        });
      }

      const withRelations = await tx.booking.findUnique({
        where: { id: booking.id },
        include: this.bookingInclude,
      });

      return withRelations as BookingWithRelations;
    });
  }

  // Read
  async findById(id: string): Promise<BookingWithRelations | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: this.bookingInclude,
    });
  }

  async findByUserId(userId: string): Promise<BookingWithRelations[]> {
    return await prisma.booking.findMany({
      where: { user_id: userId },
      include: this.bookingInclude,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByStatus(status: string): Promise<BookingWithRelations[]> {
    return await prisma.booking.findMany({
      where: { status },
      include: this.bookingInclude,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]> {
    return await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: this.bookingInclude,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findAll(skip?: number, take?: number): Promise<BookingWithRelations[]> {
    return await prisma.booking.findMany({
      skip,
      take,
      include: this.bookingInclude,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByCompanyOwnerId(ownerId: string): Promise<BookingWithRelations[]> {
    const companies = await prisma.company.findMany({
      where: { owner_id: ownerId },
      select: { id: true },
    });

    const companyIds = companies.map((company) => company.id);
    if (companyIds.length === 0) {
      return [];
    }

    return await prisma.booking.findMany({
      where: {
        OR: [
          {
            itinerary: {
              company_id: { in: companyIds },
            },
          },
          {
            items: {
              some: {
                itinerary: {
                  company_id: { in: companyIds },
                },
              },
            },
          },
        ],
      },
      include: this.bookingInclude,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findWithUser(id: string): Promise<BookingWithRelations | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: this.bookingInclude,
    });
  }

  async findWithItems(id: string): Promise<BookingWithRelations | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: this.bookingInclude,
    });
  }

  async findComplete(id: string): Promise<BookingWithRelations | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: this.bookingInclude,
    });
  }

  // Update
  async update(id: string, data: BookingUpdatePayload): Promise<BookingWithRelations> {
    return await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: {
          itinerary_id: data.itineraryId,
          type: data.type,
          description: data.description,
          status: data.status,
          date: data.date,
        },
      });

      if (data.itineraryId) {
        await tx.bookingItem.deleteMany({ where: { booking_id: id } });
        await tx.bookingItem.create({
          data: {
            booking_id: id,
            itinerary_id: data.itineraryId,
          },
        });
      }

      if (data.members) {
        await tx.bookingMember.deleteMany({ where: { booking_id: id } });

        if (data.members.length > 0) {
          await tx.bookingMember.createMany({
            data: data.members.map((member) => ({
              booking_id: id,
              name: member.name,
              email: member.email,
              phone: member.phone,
            })),
          });
        }
      }

      const withRelations = await tx.booking.findUnique({
        where: { id },
        include: this.bookingInclude,
      });

      return withRelations as BookingWithRelations;
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
    await prisma.bookingItem.deleteMany({ where: { booking_id: id } });
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
