import { Request, Response } from 'express';
import { ItineraryRatingService } from '../services/ItineraryRatingService';

type AuthUser = {
  id: string;
  userId: string;
  role: string;
};

export class ItineraryRatingController {
  private ratingService: ItineraryRatingService;

  constructor() {
    this.ratingService = new ItineraryRatingService();
  }

  // Create a new rating
  createRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as Request & { user?: AuthUser }).user;
      const userId = user?.id || user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const itineraryId = String(req.params.itinerary_id);
      const {
        rating,
        title,
        comment,
        good_value,
        good_guide,
        well_organized,
        safe,
        would_recommend,
        verified_booking,
        booking_id,
      } = req.body;

      if (!rating || rating < 1 || rating > 10) {
        res.status(400).json({ error: 'Rating must be between 1 and 10' });
        return;
      }

      const newRating = await this.ratingService.createRating(
        userId,
        itineraryId,
        rating,
        title,
        comment,
        good_value,
        good_guide,
        well_organized,
        safe,
        would_recommend,
        verified_booking,
        booking_id
      );

      res.status(201).json(newRating);
    } catch (error) {
      console.error('Error creating rating:', error);
      const message = error instanceof Error ? error.message : 'Failed to create rating';
      res.status(400).json({ error: message });
    }
  };

  // Update a rating
  updateRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as Request & { user?: AuthUser }).user;
      const userId = user?.id || user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const ratingId = String(req.params.rating_id);
      const {
        rating,
        title,
        comment,
        good_value,
        good_guide,
        well_organized,
        safe,
        would_recommend,
      } = req.body;

      const updatedRating = await this.ratingService.updateRating(
        ratingId,
        userId,
        rating,
        title,
        comment,
        good_value,
        good_guide,
        well_organized,
        safe,
        would_recommend
      );

      res.status(200).json(updatedRating);
    } catch (error) {
      console.error('Error updating rating:', error);
      const message = error instanceof Error ? error.message : 'Failed to update rating';
      res.status(400).json({ error: message });
    }
  };

  // Delete a rating
  deleteRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as Request & { user?: AuthUser }).user;
      const userId = user?.id || user?.userId;
      const userRole = user?.role;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const ratingId = String(req.params.rating_id);
      const isAdmin = userRole === 'admin';

      await this.ratingService.deleteRating(ratingId, userId, isAdmin);

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting rating:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete rating';
      res.status(400).json({ error: message });
    }
  };

  // Get rating by ID
  getRatingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const ratingId = String(req.params.rating_id);

      const rating = await this.ratingService.getRatingById(ratingId);

      if (!rating) {
        res.status(404).json({ error: 'Rating not found' });
        return;
      }

      res.status(200).json(rating);
    } catch (error) {
      console.error('Error fetching rating:', error);
      res.status(500).json({ error: 'Failed to fetch rating' });
    }
  };

  // Get all ratings for an itinerary
  getRatingsByItinerary = async (req: Request, res: Response): Promise<void> => {
    try {
      const itineraryId = String(req.params.itinerary_id);

      const ratings = await this.ratingService.getRatingsByItinerary(itineraryId);

      res.status(200).json(ratings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      res.status(500).json({ error: 'Failed to fetch ratings' });
    }
  };

  // Get all ratings by a user
  getRatingsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as Request & { user?: AuthUser }).user;
      const userId = user?.id || user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const ratings = await this.ratingService.getRatingsByUser(userId);

      res.status(200).json(ratings);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      res.status(500).json({ error: 'Failed to fetch user ratings' });
    }
  };

  // Get user's rating for a specific itinerary
  getUserRatingForItinerary = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as Request & { user?: AuthUser }).user;
      const userId = user?.id || user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const itineraryId = String(req.params.itinerary_id);

      const rating = await this.ratingService.getUserRatingForItinerary(userId, itineraryId);

      if (!rating) {
        res.status(404).json({ error: 'Rating not found' });
        return;
      }

      res.status(200).json(rating);
    } catch (error) {
      console.error('Error fetching user rating:', error);
      res.status(500).json({ error: 'Failed to fetch user rating' });
    }
  };

  // Get rating statistics for an itinerary
  getRatingStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const itineraryId = String(req.params.itinerary_id);

      const statistics = await this.ratingService.getRatingStatistics(itineraryId);

      res.status(200).json(statistics);
    } catch (error) {
      console.error('Error fetching rating statistics:', error);
      res.status(500).json({ error: 'Failed to fetch rating statistics' });
    }
  };
}
