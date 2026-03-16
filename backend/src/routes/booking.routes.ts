import { Router } from 'express';
import * as BookingController from '../controllers/BookingController';

const router = Router();

router.get('/', BookingController.getAllBookings);
router.get('/:id', BookingController.getBookingById);
router.post('/', BookingController.createBooking);
router.put('/:id', BookingController.updateBooking);
router.delete('/:id', BookingController.deleteBooking);

export default router;
