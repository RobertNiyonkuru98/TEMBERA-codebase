import { CompanyRatingRepository } from '../repositories/implementations/CompanyRatingRepository';
import { CompanyRating } from '@prisma/client';
import { BadRequestError, NotFoundError } from '@/utils/http-error';

export class CompanyRatingService {
  private ratingRepository = new CompanyRatingRepository();

  async createOrUpdateRating(
    userId: string,
    companyId: string,
    rating: number,
    comment?: string
  ): Promise<CompanyRating> {
    // Validate rating is between 1-10
    if (rating < 1 || rating > 10) {
      throw new BadRequestError('Rating must be between 1 and 10');
    }

    return await this.ratingRepository.upsert(userId, companyId, { rating, comment });
  }

  async getRatingById(id: string): Promise<CompanyRating | null> {
    return await this.ratingRepository.findById(id);
  }

  async getUserRatingForCompany(userId: string, companyId: string): Promise<CompanyRating | null> {
    return await this.ratingRepository.findByUserAndCompany(userId, companyId);
  }

  async getCompanyRatings(companyId: string): Promise<CompanyRating[]> {
    return await this.ratingRepository.findByCompanyId(companyId);
  }

  async getUserRatings(userId: string): Promise<CompanyRating[]> {
    return await this.ratingRepository.findByUserId(userId);
  }

  async deleteRating(id: string, userId: string): Promise<void> {
    const rating = await this.ratingRepository.findById(id);
    
    if (!rating) {
      throw new NotFoundError('Rating not found');
    }

    // Ensure user can only delete their own rating
    if (rating.user_id !== userId) {
      throw new BadRequestError('You can only delete your own ratings');
    }

    await this.ratingRepository.delete(id);
  }

  async getCompanyRatingStats(companyId: string): Promise<{ average: number; count: number; ratings: CompanyRating[] }> {
    const [stats, ratings] = await Promise.all([
      this.ratingRepository.getRatingStats(companyId),
      this.ratingRepository.findByCompanyId(companyId),
    ]);

    return {
      average: stats.average,
      count: stats.count,
      ratings,
    };
  }
}
