import { ItineraryService } from '@/services/ItineraryService';
import { ResponseHandler } from '@/utils/response';
import { NotFoundError } from '@/utils/http-error';
import { Request, Response } from 'express';

const itineraryService = new ItineraryService();

export const getAllItineraries = async (_req: Request, res: Response) => {
  const itineraries = await itineraryService.getAll();
  ResponseHandler.success(res, 200, 'Itineraries retrieved successfully', itineraries);
};

export const getItineraryById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const itinerary = await itineraryService.getById(id);
  if (!itinerary) throw new NotFoundError('Itinerary not found');
  ResponseHandler.success(res, 200, 'Itinerary retrieved successfully', itinerary);
};

export const createItinerary = async (req: Request, res: Response) => {
  const itinerary = await itineraryService.create(req.body);
  ResponseHandler.success(res, 201, 'Itinerary created successfully', itinerary);
};

export const updateItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const itinerary = await itineraryService.update(id, req.body);
  if (!itinerary) throw new NotFoundError('Itinerary not found');
  ResponseHandler.success(res, 200, 'Itinerary updated successfully', itinerary);
};

export const deleteItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await itineraryService.delete(id);
  if (!deleted) throw new NotFoundError('Itinerary not found');
  ResponseHandler.success(res, 200, 'Itinerary deleted successfully', null);
};
