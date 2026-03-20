import { Router } from 'express';
import {
    getAllItineraries,
getItineraryById,
createItinerary,
createItineraryImages,
addCloudinaryImagesToItinerary,
updateItinerary,
deleteItinerary,
}  from '../controllers/ItineraryController';
import { asyncWrapper } from '@/utils/async.wrapper';
import { uploadItineraryImages } from '@/middlewares/upload.middleware';
import { authenticateToken } from '@/middlewares/auth.middleware';

const router = Router();

router.get('/', asyncWrapper(getAllItineraries));
router.get('/:id', asyncWrapper(getItineraryById));
router.post('/',authenticateToken, asyncWrapper(createItinerary));
router.post('/:id/images',authenticateToken, uploadItineraryImages.array('images', 10), asyncWrapper(createItineraryImages));
router.post('/:id/cloudinary-images', authenticateToken, asyncWrapper(addCloudinaryImagesToItinerary));
router.put('/:id', authenticateToken, asyncWrapper(updateItinerary));
router.delete('/:id', authenticateToken, asyncWrapper(deleteItinerary));

export default router;
