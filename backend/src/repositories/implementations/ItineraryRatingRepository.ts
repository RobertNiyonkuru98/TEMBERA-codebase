import { ItineraryRating, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { IItineraryRatingRepository } from '../interfaces/IItineraryRatingRepository';

export class ItineraryRatingRepository implements IItineraryRatingRepository {
  async create(data: Prisma.ItineraryRatingCreateInput): Promise<ItineraryRating> {
    return await prisma.itineraryRating.create({ data });
  }

  async findById(id: string): Promise<ItineraryRating | null> {
    return await prisma.itineraryRating.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        itinerary: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findByItineraryId(itineraryId: string): Promise<ItineraryRating[]> {
    return await prisma.itineraryRating.findMany({
      where: { itinerary_id: itineraryId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByUserId(userId: string): Promise<ItineraryRating[]> {
    return await prisma.itineraryRating.findMany({
      where: { user_id: userId },
      include: {
        itinerary: {
          select: {
            id: true,
            title: true,
            activity: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByUserAndItinerary(userId: string, itineraryId: string): Promise<ItineraryRating | null> {
    return await prisma.itineraryRating.findUnique({
      where: {
        user_id_itinerary_id: {
          user_id: userId,
          itinerary_id: itineraryId,
        },
      },
    });
  }

  async update(id: string, data: Prisma.ItineraryRatingUpdateInput): Promise<ItineraryRating> {
    return await prisma.itineraryRating.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.itineraryRating.delete({ where: { id } });
  }

  async getAverageRating(itineraryId: string): Promise<number | null> {
    const result = await prisma.itineraryRating.aggregate({
      where: { itinerary_id: itineraryId },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating;
  }

  async getRatingCount(itineraryId: string): Promise<number> {
    return await prisma.itineraryRating.count({
      where: { itinerary_id: itineraryId },
    });
  }

  async getRatingDistribution(itineraryId: string): Promise<Record<number, number>> {
    const ratings = await prisma.itineraryRating.findMany({
      where: { itinerary_id: itineraryId },
      select: { rating: true },
    });

    const distribution: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      distribution[i] = 0;
    }

    ratings.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return distribution;
  }
}
