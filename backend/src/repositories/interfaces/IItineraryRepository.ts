import { Itinerary, Prisma } from '@prisma/client';

export interface IItineraryRepository {
  // Create
  create(data: Prisma.ItineraryCreateInput): Promise<Itinerary>;

  // Read
  findById(id: bigint): Promise<Itinerary | null>;
  findByCompanyId(companyId: bigint): Promise<Itinerary[]>;
  findByLocation(location: string): Promise<Itinerary[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Itinerary[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Itinerary[]>;
  findAll(skip?: number, take?: number): Promise<Itinerary[]>;
  findWithCompany(id: bigint): Promise<Itinerary | null>;

  // Update
  update(id: bigint, data: Prisma.ItineraryUpdateInput): Promise<Itinerary>;
  updatePrice(id: bigint, price: number): Promise<Itinerary>;
  updateDate(id: bigint, date: Date): Promise<Itinerary>;

  // Count
  count(): Promise<number>;
}
