import { Booking, Prisma } from '@prisma/client';

export interface IBookingRepository {
  // Create
  create(data: Prisma.BookingCreateInput): Promise<Booking>;

  // Read
  findById(id: bigint): Promise<Booking | null>;
  findByUserId(userId: bigint): Promise<Booking[]>;
  findByStatus(status: string): Promise<Booking[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
  findAll(skip?: number, take?: number): Promise<Booking[]>;
  findWithUser(id: bigint): Promise<Booking | null>;
  findWithItems(id: bigint): Promise<Booking | null>;
  findComplete(id: bigint): Promise<Booking | null>;

  // Update
  update(id: bigint, data: Prisma.BookingUpdateInput): Promise<Booking>;
  updateStatus(id: bigint, status: string): Promise<Booking>;

  // Count
  count(): Promise<number>;
  countByStatus(status: string): Promise<number>;
}
