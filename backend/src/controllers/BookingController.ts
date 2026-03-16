import { BookingService } from '@/services/BookingService';
import { NotFoundError } from '@/utils/http-error';
import { ResponseHandler } from '@/utils/response';
import { Request, Response } from 'express';

const bookingService = new BookingService();

// Booking endpoints
export const getAllBookings = async (_req: Request, res: Response) => {
  const bookings = await bookingService.getAll();
  return ResponseHandler.success(res, 200, 'Bookings retrieved successfully', bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const booking = await bookingService.getById(id);
  if (!booking) throw new NotFoundError('Booking not found');
  return ResponseHandler.success(res, 200, 'Booking retrieved successfully', booking);
};

export const createBooking = async (req: Request, res: Response) => {
  const booking = await bookingService.create(req.body);
  return ResponseHandler.success(res, 201, 'Booking created successfully', booking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const booking = await bookingService.update(id, req.body);
  if (!booking) throw new NotFoundError('Booking not found');
  return ResponseHandler.success(res, 200, 'Booking updated successfully', booking);
};

export const deleteBooking = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await bookingService.delete(id);
  if (!deleted) throw new NotFoundError('Booking not found');
  return ResponseHandler.success(res, 200, 'Booking deleted successfully', null);
};

// BookingItem endpoints
export const getAllBookingItems = async (_req: Request, res: Response) => {
  const items = await bookingService.getAllItems();
  return ResponseHandler.success(res, 200, 'Booking items retrieved successfully', items);
};

export const getBookingItemById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const item = await bookingService.getItemById(id);
  if (!item) throw new NotFoundError('Booking item not found');
  return ResponseHandler.success(res, 200, 'Booking item retrieved successfully', item);
};

export const createBookingItem = async (req: Request, res: Response) => {
  const item = await bookingService.createItem(req.body);
  return ResponseHandler.success(res, 201, 'Booking item created successfully', item);
};

export const updateBookingItem = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const item = await bookingService.updateItem(id, req.body);
  if (!item) throw new NotFoundError('Booking item not found');
  return ResponseHandler.success(res, 200, 'Booking item updated successfully', item);
};

export const deleteBookingItem = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await bookingService.deleteItem(id);
  if (!deleted) throw new NotFoundError('Booking item not found');
  return ResponseHandler.success(res, 200, 'Booking item deleted successfully', null);
};
