import { Booking, Prisma } from '@prisma/client';

export interface IBookingRepository {
  // Create
  create(data: Prisma.BookingCreateInput): Promise<Booking>;

  // Read
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByStatus(status: string): Promise<Booking[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
  findAll(skip?: number, take?: number): Promise<Booking[]>;
  findWithUser(id: string): Promise<Booking | null>;
  findWithItems(id: string): Promise<Booking | null>;
  findComplete(id: string): Promise<Booking | null>;

  // Update
  update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking>;
  updateStatus(id: string, status: string): Promise<Booking>;

  // Count
  count(): Promise<number>;
  countByStatus(status: string): Promise<number>;
}
