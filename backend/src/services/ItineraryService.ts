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

  async create(data: Prisma.ItineraryCreateInput): Promise<Itinerary> {
    const itinerary = await this.itineraryRepository.create(data);
    return itinerary;
  }
async addImages(id: string, imagePaths: string[]): Promise<Itinerary | null> {
    const itinerary = await this.itineraryRepository.findById(id);
    if (!itinerary) return null;
    await this.itineraryRepository.createImages(id, imagePaths);
    return this.itineraryRepository.findById(id);
  }

  async addCloudinaryImages(id: string, imageUrls: string[]): Promise<Itinerary | null> {
    const itinerary = await this.itineraryRepository.findById(id);
    if (!itinerary) return null;
    await this.itineraryRepository.createCloudinaryImages(id, imageUrls);
    return this.itineraryRepository.findById(id);
  }

  async addVideos(id: string, videoData: Array<{ url: string; publicId: string; thumbnailUrl?: string }>): Promise<Itinerary | null> {
    const itinerary = await this.itineraryRepository.findById(id);
    if (!itinerary) return null;
    await this.itineraryRepository.createVideos(id, videoData);
    return this.itineraryRepository.findById(id);
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
