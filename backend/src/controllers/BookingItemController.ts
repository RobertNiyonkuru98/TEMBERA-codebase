import { Request, Response } from 'express';
import { BookingItemService } from '../services/BookingItemService';

const bookingItemService = new BookingItemService();

export const getAllBookingItems = async (req: Request, res: Response) => {
  const items = await bookingItemService.getAll();
  res.json(items);
};

export const getBookingItemById = async (req: Request, res: Response) => {
  const item = await bookingItemService.getById(req.params.id);
  if (!item) return res.status(404).json({ message: 'BookingItem not found' });
  res.json(item);
};

export const createBookingItem = async (req: Request, res: Response) => {
  const item = await bookingItemService.create(req.body);
  res.status(201).json(item);
};

export const updateBookingItem = async (req: Request, res: Response) => {
  const item = await bookingItemService.update(req.params.id, req.body);
  if (!item) return res.status(404).json({ message: 'BookingItem not found' });
  res.json(item);
};

export const deleteBookingItem = async (req: Request, res: Response) => {
  const deleted = await bookingItemService.delete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'BookingItem not found' });
  res.status(204).send();
};
