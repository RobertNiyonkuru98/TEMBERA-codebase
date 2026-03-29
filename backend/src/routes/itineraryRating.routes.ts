import { Router } from 'express';
import { ItineraryRatingController } from '../controllers/ItineraryRatingController';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const ratingController = new ItineraryRatingController();

// All rating routes require authentication
router.use(authenticateToken);

// Create a rating for an itinerary
router.post('/itinerary/:itinerary_id/rating', ratingController.createRating);

// Update a rating
router.put('/rating/:rating_id', ratingController.updateRating);

// Delete a rating
router.delete('/rating/:rating_id', ratingController.deleteRating);

// Get a specific rating by ID
router.get('/rating/:rating_id', ratingController.getRatingById);

// Get all ratings for an itinerary
router.get('/itinerary/:itinerary_id/ratings', ratingController.getRatingsByItinerary);

// Get all ratings by the authenticated user
router.get('/user/ratings', ratingController.getRatingsByUser);

// Get user's rating for a specific itinerary
router.get('/itinerary/:itinerary_id/user-rating', ratingController.getUserRatingForItinerary);

// Get rating statistics for an itinerary
router.get('/itinerary/:itinerary_id/rating-stats', ratingController.getRatingStatistics);

export default router;
