import { Router } from 'express';
import * as BookingItemController from '../controllers/BookingItemController';

const router = Router();

router.get('/', BookingItemController.getAllBookingItems);
router.get('/:id', BookingItemController.getBookingItemById);
router.post('/', BookingItemController.createBookingItem);
router.put('/:id', BookingItemController.updateBookingItem);
router.delete('/:id', BookingItemController.deleteBookingItem);

export default router;
