import { Router } from 'express';
import {
    getAllItineraries,
getItineraryById,
createItinerary,
updateItinerary,
deleteItinerary,
}  from '../controllers/ItineraryController';
import { asyncWrapper } from '@/utils/async.wrapper';

const router = Router();

router.get('/', asyncWrapper(getAllItineraries));
router.get('/:id', asyncWrapper(getItineraryById));
router.post('/', asyncWrapper(createItinerary));
router.put('/:id', asyncWrapper(updateItinerary));
router.delete('/:id', asyncWrapper(deleteItinerary));

export default router;
