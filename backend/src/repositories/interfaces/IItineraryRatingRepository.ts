import { ItineraryRating, Prisma } from '@prisma/client';

export interface IItineraryRatingRepository {
  create(data: Prisma.ItineraryRatingCreateInput): Promise<ItineraryRating>;
  findById(id: string): Promise<ItineraryRating | null>;
  findByItineraryId(itineraryId: string): Promise<ItineraryRating[]>;
  findByUserId(userId: string): Promise<ItineraryRating[]>;
  findByUserAndItinerary(userId: string, itineraryId: string): Promise<ItineraryRating | null>;
  update(id: string, data: Prisma.ItineraryRatingUpdateInput): Promise<ItineraryRating>;
  delete(id: string): Promise<void>;
  getAverageRating(itineraryId: string): Promise<number | null>;
  getRatingCount(itineraryId: string): Promise<number>;
  getRatingDistribution(itineraryId: string): Promise<Record<number, number>>;
}
