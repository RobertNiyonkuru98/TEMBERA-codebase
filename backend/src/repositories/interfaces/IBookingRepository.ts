import { Booking, Prisma } from '@prisma/client';

export interface IBookingRepository {
  // BookingItem methods
  findAllItems(skip?: number, take?: number): Promise<any[]>;
  findItemById(id: string): Promise<any | null>;
  createItem(data: any): Promise<any>;
  updateItem(id: string, data: any): Promise<any>;
  deleteItem(id: string): Promise<void>;
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

  // Delete
  delete(id: string): Promise<void>;

  // Count
  count(): Promise<number>;
  countByStatus(status: string): Promise<number>;
}
