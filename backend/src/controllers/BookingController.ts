import { Request, Response } from 'express';
import { BookingService } from '../services/BookingService';

const bookingService = new BookingService();

export const getAllBookings = async (req: Request, res: Response) => {
  const bookings = await bookingService.getAll();
  res.json(bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
  const booking = await bookingService.getById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const createBooking = async (req: Request, res: Response) => {
  const booking = await bookingService.create(req.body);
  res.status(201).json(booking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const booking = await bookingService.update(req.params.id, req.body);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const deleteBooking = async (req: Request, res: Response) => {
  const deleted = await bookingService.delete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Booking not found' });
  res.status(204).send();
};
