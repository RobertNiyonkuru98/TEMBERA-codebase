import { Router } from 'express';
import * as ItineraryController from '../controllers/ItineraryController';

const router = Router();

router.get('/', ItineraryController.getAllItineraries);
router.get('/:id', ItineraryController.getItineraryById);
router.post('/', ItineraryController.createItinerary);
router.put('/:id', ItineraryController.updateItinerary);
router.delete('/:id', ItineraryController.deleteItinerary);

export default router;
