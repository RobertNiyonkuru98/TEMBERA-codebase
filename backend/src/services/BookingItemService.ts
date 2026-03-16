import { BookingItemRepository } from '../repositories/implementations/BookingItemRepository';
import { Prisma, BookingItem } from '@prisma/client';

export class BookingItemService {
  private bookingItemRepository = new BookingItemRepository();

  async getAll(): Promise<BookingItem[]> {
    return this.bookingItemRepository.findAll();
  }

  async getById(id: string): Promise<BookingItem | null> {
    return this.bookingItemRepository.findById(id);
  }

  async create(data: Prisma.BookingItemCreateInput): Promise<BookingItem> {
    return this.bookingItemRepository.create(data);
  }

  async update(id: string, data: Prisma.BookingItemUpdateInput): Promise<BookingItem | null> {
    try {
      return await this.bookingItemRepository.update(id, data);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.bookingItemRepository.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
