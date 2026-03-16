import { Itinerary, Prisma } from '@prisma/client';

export interface IItineraryRepository {
  // Create
  create(data: Prisma.ItineraryCreateInput): Promise<Itinerary>;

  // Read
  findById(id: string): Promise<Itinerary | null>;
  findByCompanyId(companyId: string): Promise<Itinerary[]>;
  findByLocation(location: string): Promise<Itinerary[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Itinerary[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Itinerary[]>;
  findAll(skip?: number, take?: number): Promise<Itinerary[]>;
  findWithCompany(id: string): Promise<Itinerary | null>;

  // Update
  update(id: string, data: Prisma.ItineraryUpdateInput): Promise<Itinerary>;
  updatePrice(id: string, price: number): Promise<Itinerary>;
  updateDate(id: string, date: Date): Promise<Itinerary>;

  // Delete
  delete(id: string): Promise<void>;

  // Count
  count(): Promise<number>;
}
