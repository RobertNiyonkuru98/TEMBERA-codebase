import { CompanyRatingService } from '@/services/CompanyRatingService';
import { ResponseHandler } from '@/utils/response';
import { Request, Response } from 'express';
import { BadRequestError } from '@/utils/http-error';

const ratingService = new CompanyRatingService();

// Create or update a rating for a company
export const createOrUpdateRating = async (req: Request, res: Response) => {
  const companyId = String(req.params.companyId);
  const { rating, comment } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new BadRequestError('User authentication required');
  }

  if (!rating) {
    throw new BadRequestError('Rating is required');
  }

  const ratingData = await ratingService.createOrUpdateRating(
    String(userId),
    companyId,
    Number(rating),
    comment
  );

  return ResponseHandler.success(
    res,
    201,
    'Rating submitted successfully',
    ratingData
  );
};

// Get all ratings for a specific company
export const getCompanyRatings = async (req: Request, res: Response) => {
  const companyId = String(req.params.companyId);
  const ratings = await ratingService.getCompanyRatings(companyId);
  
  return ResponseHandler.success(
    res,
    200,
    'Company ratings retrieved successfully',
    ratings
  );
};

// Get company rating statistics (average, count, and all ratings)
export const getCompanyRatingStats = async (req: Request, res: Response) => {
  const companyId = String(req.params.companyId);
  const stats = await ratingService.getCompanyRatingStats(companyId);
  
  return ResponseHandler.success(
    res,
    200,
    'Company rating statistics retrieved successfully',
    stats
  );
};

// Get current user's rating for a specific company
export const getUserRatingForCompany = async (req: Request, res: Response) => {
  const companyId = String(req.params.companyId);
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new BadRequestError('User authentication required');
  }

  const rating = await ratingService.getUserRatingForCompany(String(userId), companyId);
  
  return ResponseHandler.success(
    res,
    200,
    rating ? 'User rating retrieved successfully' : 'No rating found',
    rating
  );
};

// Get all ratings submitted by the current user
export const getUserRatings = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new BadRequestError('User authentication required');
  }

  const ratings = await ratingService.getUserRatings(String(userId));
  
  return ResponseHandler.success(
    res,
    200,
    'User ratings retrieved successfully',
    ratings
  );
};

// Delete a rating
export const deleteRating = async (req: Request, res: Response) => {
  const ratingId = String(req.params.ratingId);
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new BadRequestError('User authentication required');
  }

  await ratingService.deleteRating(ratingId, String(userId));
  
  return ResponseHandler.success(
    res,
    200,
    'Rating deleted successfully',
    null
  );
};
