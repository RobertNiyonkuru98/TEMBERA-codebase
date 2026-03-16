import { BookingRepository } from '../repositories/implementations/BookingRepository';
import { Prisma, Booking } from '@prisma/client';

export class BookingService {
  private bookingRepository = new BookingRepository();

  async getAll(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }

  async getById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    return this.bookingRepository.create(data);
  }

  async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking | null> {
    try {
      return await this.bookingRepository.update(id, data);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.bookingRepository.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
