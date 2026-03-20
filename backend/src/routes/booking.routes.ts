import { Router } from 'express';
import {
getAllBookings,
getBookingById,
createBooking,
updateBooking,
deleteBooking,
getAllBookingItems,
getBookingItemById,
createBookingItem,
updateBookingItem,
deleteBookingItem,
getBookingMembers,
createBookingMember,
updateBookingMember,
deleteBookingMember,
}  from '../controllers/BookingController';
import { asyncWrapper } from '@/utils/async.wrapper';

const router = Router();

// Booking endpoints
router.get('/', asyncWrapper(getAllBookings));
router.get('/items', asyncWrapper(getAllBookingItems));
router.get('/items/:id', asyncWrapper(getBookingItemById));
router.post('/items', asyncWrapper(createBookingItem));
router.put('/items/:id', asyncWrapper(updateBookingItem));
router.delete('/items/:id', asyncWrapper(deleteBookingItem));
router.get('/:bookingId/members', asyncWrapper(getBookingMembers));
router.post('/:bookingId/members', asyncWrapper(createBookingMember));
router.put('/members/:memberId', asyncWrapper(updateBookingMember));
router.delete('/members/:memberId', asyncWrapper(deleteBookingMember));

router.get('/:id', asyncWrapper(getBookingById));
router.post('/', asyncWrapper(createBooking));
router.put('/:id', asyncWrapper(updateBooking));
router.delete('/:id', asyncWrapper(deleteBooking));

export default router;
