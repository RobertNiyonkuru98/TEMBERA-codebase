import { ItineraryService } from '@/services/ItineraryService';
import { ResponseHandler } from '@/utils/response';
import { BadRequestError, NotFoundError } from '@/utils/http-error';
import { normalizeDate } from '@/utils/date.validator';
import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const itineraryService = new ItineraryService();

type ItineraryImagePayload = {
  id?: string;
  image_url: string;
  public_id: string;
  order?: number;
  image_blob?: string | null;
};

type ItineraryWithImagesPayload = {
  id: string;
  images?: ItineraryImagePayload[];
  [key: string]: unknown;
};

const uploadsDirectory = path.join(path.resolve(), 'uploads');

function toPublicImageUrl(req: Request, imagePath: string): string {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${req.protocol}://${req.get('host')}${normalizedPath}`;
}

function inferMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.png') return 'image/png';
  if (extension === '.webp') return 'image/webp';
  if (extension === '.gif') return 'image/gif';
  if (extension === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

async function toBlobDataUrl(imagePath: string): Promise<string | null> {
  try {
    const fileName = path.basename(imagePath);
    const absolutePath = path.join(uploadsDirectory, fileName);
    const content = await fs.readFile(absolutePath);
    const mimeType = inferMimeType(absolutePath);
    return `data:${mimeType};base64,${content.toString('base64')}`;
  } catch {
    return null;
  }
}

async function presentItineraryImages(
  itinerary: ItineraryWithImagesPayload,
  includeBlobs: boolean,
): Promise<ItineraryWithImagesPayload> {
  const rawImages = Array.isArray(itinerary.images) ? itinerary.images : [];

  const images = await Promise.all(
    rawImages.map(async (image) => {
      // image_url is already a full URL from Cloudinary or a local path
      const imageUrl = image.image_url;
      const imageBlob = includeBlobs && !imageUrl.startsWith('http') ? await toBlobDataUrl(imageUrl) : null;
      return {
        ...image,
        image_url: imageUrl,
        image_blob: imageBlob,
      };
    }),
  );

  return {
    ...itinerary,
    images,
    image_urls: images.map((image) => image.image_url),
    image_blobs: includeBlobs ? images.map((image) => image.image_blob).filter(Boolean) : [],
  };
}

export const getAllItineraries = async (req: Request, res: Response) => {
  const includeBlobs = String(req.query.include_blobs).toLowerCase() === 'true';
  const itineraries = await itineraryService.getAll();
  const presentable = await Promise.all(
    (itineraries as ItineraryWithImagesPayload[]).map((itinerary) =>
      presentItineraryImages(itinerary, includeBlobs),
    ),
  );
  ResponseHandler.success(res, 200, 'Itineraries retrieved successfully', presentable);
};

export const getItineraryById = async (req: Request, res: Response) => {
  const includeBlobs = String(req.query.include_blobs).toLowerCase() === 'true';
  const id = String(req.params.id);
  const itinerary = await itineraryService.getById(id);
  if (!itinerary) throw new NotFoundError('Itinerary not found');
  const presentable = await presentItineraryImages(
    itinerary as ItineraryWithImagesPayload,
    includeBlobs,
  );
  ResponseHandler.success(res, 200, 'Itinerary retrieved successfully', presentable);
};

export const createItinerary = async (req: Request, res: Response) => {
  if (!req.body?.date) {
    throw new  BadRequestError('Date is required to create an itinerary');
  }
  if (!req.body.price) {
    throw new  BadRequestError('Price is required to create an itinerary');
  }
    const normalizedDate = normalizeDate(req.body.date);
    const { imageUrls, ...itineraryData } = req.body;
    const itineraryPayload = {
      ...itineraryData,
      price: Number(req.body.price),
      date: normalizedDate,
    };

  const itinerary = await itineraryService.create(itineraryPayload);
  
  // Add images if provided
  if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
    await itineraryService.addCloudinaryImages(itinerary.id, imageUrls);
  }
  
  const presentable = await presentItineraryImages(
    itinerary as ItineraryWithImagesPayload,
    false,
  );
  ResponseHandler.success(res, 201, 'Itinerary created successfully', presentable);
};

export const createItineraryImages = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) {
    throw new NotFoundError('No images uploaded');
  }
  const imageUrls = files.map((file) => toPublicImageUrl(req, `/uploads/${file.filename}`));
  const updatedItinerary = await itineraryService.addImages(id, imageUrls);
  if (!updatedItinerary) throw new NotFoundError('Itinerary not found');
  const presentable = await presentItineraryImages(
    updatedItinerary as ItineraryWithImagesPayload,
    true,
  );
  ResponseHandler.success(res, 200, 'Itinerary images added successfully', presentable);
};
export const updateItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updateData = { ...req.body };

  if (updateData.date) {
    try {
      updateData.date = normalizeDate(updateData.date);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Invalid date format for update'
      );
    }
  }

  const itinerary = await itineraryService.update(id, updateData);
  if (!itinerary) throw new NotFoundError('Itinerary not found');
  const presentable = await presentItineraryImages(
    itinerary as ItineraryWithImagesPayload,
    false,
  );
  ResponseHandler.success(res, 200, 'Itinerary updated successfully', presentable);
};

export const deleteItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await itineraryService.delete(id);
  if (!deleted) throw new NotFoundError('Itinerary not found');
  ResponseHandler.success(res, 200, 'Itinerary deleted successfully', null);
};
