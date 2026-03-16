import { ItineraryService } from '@/services/ItineraryService';
import { Request, Response } from 'express';

const itineraryService = new ItineraryService();

export const getAllItineraries = async (_req: Request, res: Response) => {
  const itineraries = await itineraryService.getAll();
  return res.json(itineraries);
};

export const getItineraryById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const itinerary = await itineraryService.getById(id);
  if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
  return res.json(itinerary);
};

export const createItinerary = async (req: Request, res: Response) => {
  const itinerary = await itineraryService.create(req.body);
  return res.status(201).json(itinerary);
};

export const updateItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const itinerary = await itineraryService.update(id, req.body);
  if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
  return res.json(itinerary);
};

export const deleteItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await itineraryService.delete(id);
  if (!deleted) return res.status(404).json({ message: 'Itinerary not found' });
  return res.status(204).send();
};
