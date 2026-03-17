import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import itineraryRoutes from './itinerary.routes';
import bookingRoutes from './booking.routes';  
import companyRoutes from './company.routes';  
import { authenticateToken } from '../middlewares/auth.middleware';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', authenticateToken, userRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/bookings', authenticateToken, bookingRoutes);
router.use('/companies', companyRoutes);
router.use((_req, res, _next) => {
  res.status(404).json({ message: "Route not found" });
});
export default router;
