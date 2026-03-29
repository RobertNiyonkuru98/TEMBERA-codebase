import { ItineraryRating } from '@prisma/client';
import { ItineraryRatingRepository } from '../repositories/implementations/ItineraryRatingRepository';
import { ItineraryRepository } from '../repositories/implementations/ItineraryRepository';

export class ItineraryRatingService {
  private ratingRepository: ItineraryRatingRepository;
  private itineraryRepository: ItineraryRepository;

  constructor() {
    this.ratingRepository = new ItineraryRatingRepository();
    this.itineraryRepository = new ItineraryRepository();
  }

  async createRating(
    userId: string,
    itineraryId: string,
    rating: number,
    title?: string,
    comment?: string,
    goodValue?: boolean,
    goodGuide?: boolean,
    wellOrganized?: boolean,
    safe?: boolean,
    wouldRecommend?: boolean,
    verifiedBooking?: boolean,
    bookingId?: string
  ): Promise<ItineraryRating> {
    // Validate rating is between 1-10
    if (rating < 1 || rating > 10) {
      throw new Error('Rating must be between 1 and 10');
    }

    // Check if user already rated this itinerary
    const existingRating = await this.ratingRepository.findByUserAndItinerary(userId, itineraryId);
    if (existingRating) {
      throw new Error('You have already rated this itinerary. Use update instead.');
    }

    // Verify itinerary exists
    const itinerary = await this.itineraryRepository.findById(itineraryId);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    // Create the rating
    const newRating = await this.ratingRepository.create({
      rating,
      title,
      comment,
      good_value: goodValue,
      good_guide: goodGuide,
      well_organized: wellOrganized,
      safe,
      would_recommend: wouldRecommend,
      verified_booking: verifiedBooking ?? false,
      user: {
        connect: { id: userId },
      },
      itinerary: {
        connect: { id: itineraryId },
      },
      ...(bookingId && {
        booking: {
          connect: { id: bookingId },
        },
      }),
    });

    // Update itinerary rating statistics
    await this.itineraryRepository.updateRatingStats(itineraryId);

    return newRating;
  }

  async updateRating(
    ratingId: string,
    userId: string,
    rating?: number,
    title?: string,
    comment?: string,
    goodValue?: boolean,
    goodGuide?: boolean,
    wellOrganized?: boolean,
    safe?: boolean,
    wouldRecommend?: boolean
  ): Promise<ItineraryRating> {
    // Verify rating exists
    const existingRating = await this.ratingRepository.findById(ratingId);
    if (!existingRating) {
      throw new Error('Rating not found');
    }

    // Verify user owns this rating
    if (existingRating.user_id !== userId) {
      throw new Error('You can only update your own ratings');
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 10)) {
      throw new Error('Rating must be between 1 and 10');
    }

    // Update the rating
    const updatedRating = await this.ratingRepository.update(ratingId, {
      ...(rating !== undefined && { rating }),
      ...(title !== undefined && { title }),
      ...(comment !== undefined && { comment }),
      ...(goodValue !== undefined && { good_value: goodValue }),
      ...(goodGuide !== undefined && { good_guide: goodGuide }),
      ...(wellOrganized !== undefined && { well_organized: wellOrganized }),
      ...(safe !== undefined && { safe }),
      ...(wouldRecommend !== undefined && { would_recommend: wouldRecommend }),
    });

    // Update itinerary rating statistics
    await this.itineraryRepository.updateRatingStats(existingRating.itinerary_id);

    return updatedRating;
  }

  async deleteRating(ratingId: string, userId: string, isAdmin: boolean = false): Promise<void> {
    // Verify rating exists
    const existingRating = await this.ratingRepository.findById(ratingId);
    if (!existingRating) {
      throw new Error('Rating not found');
    }

    // Verify user owns this rating or is admin
    if (!isAdmin && existingRating.user_id !== userId) {
      throw new Error('You can only delete your own ratings');
    }

    const itineraryId = existingRating.itinerary_id;

    // Delete the rating
    await this.ratingRepository.delete(ratingId);

    // Update itinerary rating statistics
    await this.itineraryRepository.updateRatingStats(itineraryId);
  }

  async getRatingById(ratingId: string): Promise<ItineraryRating | null> {
    return await this.ratingRepository.findById(ratingId);
  }

  async getRatingsByItinerary(itineraryId: string): Promise<ItineraryRating[]> {
    return await this.ratingRepository.findByItineraryId(itineraryId);
  }

  async getRatingsByUser(userId: string): Promise<ItineraryRating[]> {
    return await this.ratingRepository.findByUserId(userId);
  }

  async getUserRatingForItinerary(userId: string, itineraryId: string): Promise<ItineraryRating | null> {
    return await this.ratingRepository.findByUserAndItinerary(userId, itineraryId);
  }

  async getRatingStatistics(itineraryId: string): Promise<{
    averageRating: number | null;
    totalRatings: number;
    distribution: Record<number, number>;
  }> {
    const [averageRating, totalRatings, distribution] = await Promise.all([
      this.ratingRepository.getAverageRating(itineraryId),
      this.ratingRepository.getRatingCount(itineraryId),
      this.ratingRepository.getRatingDistribution(itineraryId),
    ]);

    return {
      averageRating,
      totalRatings,
      distribution,
    };
  }
}
