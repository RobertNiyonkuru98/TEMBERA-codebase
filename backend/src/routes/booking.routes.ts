import { Router } from 'express';
import * as BookingController from '../controllers/BookingController';

const router = Router();

// Booking endpoints
router.get('/', BookingController.getAllBookings);
router.get('/:id', BookingController.getBookingById);
router.post('/', BookingController.createBooking);
router.put('/:id', BookingController.updateBooking);
router.delete('/:id', BookingController.deleteBooking);

// BookingItem endpoints
router.get('/items', BookingController.getAllBookingItems);
router.get('/items/:id', BookingController.getBookingItemById);
router.post('/items', BookingController.createBookingItem);
router.put('/items/:id', BookingController.updateBookingItem);
router.delete('/items/:id', BookingController.deleteBookingItem);

export default router;
