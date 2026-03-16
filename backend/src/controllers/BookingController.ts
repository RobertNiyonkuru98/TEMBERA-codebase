import { BookingService } from '@/services/BookingService';
import { Request, Response } from 'express';

const bookingService = new BookingService();

// Booking endpoints
export const getAllBookings = async (_req: Request, res: Response) => {
  const bookings = await bookingService.getAll();
  return res.json(bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const booking = await bookingService.getById(id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  return res.json(booking);
};

export const createBooking = async (req: Request, res: Response) => {
  const booking = await bookingService.create(req.body);
  return res.status(201).json(booking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const booking = await bookingService.update(id, req.body);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  return res.json(booking);
};

export const deleteBooking = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await bookingService.delete(id);
  if (!deleted) return res.status(404).json({ message: 'Booking not found' });
  return res.status(204).send();
};

// BookingItem endpoints
export const getAllBookingItems = async (_req: Request, res: Response) => {
  const items = await bookingService.getAllItems();
  return res.json(items);
};

export const getBookingItemById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const item = await bookingService.getItemById(id);
  if (!item) return res.status(404).json({ message: 'BookingItem not found' });
  return res.json(item);
};

export const createBookingItem = async (req: Request, res: Response) => {
  const item = await bookingService.createItem(req.body);
  return res.status(201).json(item);
};

export const updateBookingItem = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const item = await bookingService.updateItem(id, req.body);
  if (!item) return res.status(404).json({ message: 'BookingItem not found' });
  return res.json(item);
};

export const deleteBookingItem = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await bookingService.deleteItem(id);
  if (!deleted) return res.status(404).json({ message: 'BookingItem not found' });
  return res.status(204).send();
};
