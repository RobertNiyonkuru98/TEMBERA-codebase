import { ItineraryRepository } from '../repositories/implementations/ItineraryRepository';
import { Prisma, Itinerary } from '@prisma/client';

export class ItineraryService {
  private itineraryRepository = new ItineraryRepository();

  async getAll(): Promise<Itinerary[]> {
    return this.itineraryRepository.findAll();
  }

  async getById(id: string): Promise<Itinerary | null> {
    return this.itineraryRepository.findById(id);
  }

  async create(data: Prisma.ItineraryCreateInput, imagePaths: string[] = []): Promise<Itinerary> {
    const itinerary = await this.itineraryRepository.create(data);
    await this.itineraryRepository.createImages(itinerary.id, imagePaths);
    return itinerary;
  }

  async update(id: string, data: Prisma.ItineraryUpdateInput): Promise<Itinerary | null> {
    try {
      return await this.itineraryRepository.update(id, data);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.itineraryRepository.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
