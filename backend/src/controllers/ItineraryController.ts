import { ItineraryService } from '@/services/ItineraryService';
import { ResponseHandler } from '@/utils/response';
import { BadRequestError, NotFoundError } from '@/utils/http-error';
import { normalizeDate } from '@/utils/date.validator';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
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
  if (!req.body?.title) {
    throw new BadRequestError('Title is required to create an itinerary');
  }
  if (!req.body?.activity) {
    throw new BadRequestError('Activity is required to create an itinerary');
  }
  if (!req.body?.date) {
    throw new BadRequestError('Date is required to create an itinerary');
  }
  if (!req.body?.location) {
    throw new BadRequestError('Location is required to create an itinerary');
  }
  if (!req.body.company_id) {
    throw new BadRequestError('Company ID is required to create an itinerary');
  }

  const normalizedDate = normalizeDate(req.body.date);
  const { imageUrls, videoUrls, company_id, price } = req.body;
  
  // Properly structure the Prisma ItineraryCreateInput
  // Only include fields that are actually provided to avoid overriding with null/undefined
  const itineraryPayload: Prisma.ItineraryCreateInput = {
    // Basic required fields
    title: req.body.title,
    activity: req.body.activity,
    location: req.body.location,
    date: normalizedDate,
    company: {
      connect: { id: company_id }
    },
    // Optional fields - only include if provided
    ...(price && { price: Number(price) }),
    ...(req.body.description && { description: req.body.description }),
    ...(req.body.duration_days && { duration_days: Number(req.body.duration_days) }),
    ...(req.body.duration_hours && { duration_hours: Number(req.body.duration_hours) }),
    ...(req.body.start_time && { start_time: req.body.start_time }),
    ...(req.body.end_time && { end_time: req.body.end_time }),
    ...(req.body.is_multi_day !== undefined && { is_multi_day: req.body.is_multi_day }),
    ...(req.body.schedule_details && { schedule_details: req.body.schedule_details }),
    ...(req.body.min_participants && { min_participants: Number(req.body.min_participants) }),
    ...(req.body.max_participants && { max_participants: Number(req.body.max_participants) }),
    ...(req.body.available_slots !== undefined && { available_slots: Number(req.body.available_slots) }),
    ...(req.body.allows_individuals !== undefined && { allows_individuals: req.body.allows_individuals }),
    ...(req.body.allows_groups !== undefined && { allows_groups: req.body.allows_groups }),
    ...(req.body.group_discount_percent && { group_discount_percent: Number(req.body.group_discount_percent) }),
    ...(req.body.group_min_size && { group_min_size: Number(req.body.group_min_size) }),
    ...(req.body.booking_deadline && { booking_deadline: req.body.booking_deadline }),
    ...(req.body.inclusions && Array.isArray(req.body.inclusions) && { inclusions: req.body.inclusions }),
    ...(req.body.exclusions && Array.isArray(req.body.exclusions) && { exclusions: req.body.exclusions }),
    ...(req.body.provided_equipment && Array.isArray(req.body.provided_equipment) && { provided_equipment: req.body.provided_equipment }),
    ...(req.body.required_items && Array.isArray(req.body.required_items) && { required_items: req.body.required_items }),
    ...(req.body.meals_included !== undefined && { meals_included: req.body.meals_included }),
    ...(req.body.meal_types && Array.isArray(req.body.meal_types) && { meal_types: req.body.meal_types }),
    ...(req.body.food_options && { food_options: req.body.food_options }),
    ...(req.body.can_buy_food_onsite !== undefined && { can_buy_food_onsite: req.body.can_buy_food_onsite }),
    ...(req.body.can_bring_own_food !== undefined && { can_bring_own_food: req.body.can_bring_own_food }),
    ...(req.body.dietary_accommodations && { dietary_accommodations: req.body.dietary_accommodations }),
    ...(req.body.transport_included !== undefined && { transport_included: req.body.transport_included }),
    ...(req.body.transport_type && { transport_type: req.body.transport_type }),
    ...(req.body.pickup_locations && Array.isArray(req.body.pickup_locations) && { pickup_locations: req.body.pickup_locations }),
    ...(req.body.dropoff_locations && Array.isArray(req.body.dropoff_locations) && { dropoff_locations: req.body.dropoff_locations }),
    ...(req.body.allows_own_transport !== undefined && { allows_own_transport: req.body.allows_own_transport }),
    ...(req.body.parking_available !== undefined && { parking_available: req.body.parking_available }),
    ...(req.body.transport_notes && { transport_notes: req.body.transport_notes }),
    ...(req.body.meeting_point && { meeting_point: req.body.meeting_point }),
    ...(req.body.meeting_point_lat && { meeting_point_lat: Number(req.body.meeting_point_lat) }),
    ...(req.body.meeting_point_lng && { meeting_point_lng: Number(req.body.meeting_point_lng) }),
    ...(req.body.end_point && { end_point: req.body.end_point }),
    ...(req.body.end_point_lat && { end_point_lat: Number(req.body.end_point_lat) }),
    ...(req.body.end_point_lng && { end_point_lng: Number(req.body.end_point_lng) }),
    ...(req.body.location_details && { location_details: req.body.location_details }),
    ...(req.body.difficulty_level && { difficulty_level: req.body.difficulty_level }),
    ...(req.body.fitness_level_required && { fitness_level_required: req.body.fitness_level_required }),
    ...(req.body.min_age && { min_age: Number(req.body.min_age) }),
    ...(req.body.max_age && { max_age: Number(req.body.max_age) }),
    ...(req.body.age_restrictions_notes && { age_restrictions_notes: req.body.age_restrictions_notes }),
    ...(req.body.accessibility_info && { accessibility_info: req.body.accessibility_info }),
    ...(req.body.price_per_person && { price_per_person: Number(req.body.price_per_person) }),
    ...(req.body.price_per_group && { price_per_group: Number(req.body.price_per_group) }),
    ...(req.body.deposit_required && { deposit_required: Number(req.body.deposit_required) }),
    ...(req.body.deposit_percentage && { deposit_percentage: Number(req.body.deposit_percentage) }),
    ...(req.body.payment_methods && Array.isArray(req.body.payment_methods) && { payment_methods: req.body.payment_methods }),
    ...(req.body.currency && { currency: req.body.currency }),
    ...(req.body.refund_policy && { refund_policy: req.body.refund_policy }),
    ...(req.body.cancellation_policy && { cancellation_policy: req.body.cancellation_policy }),
    ...(req.body.insurance_included !== undefined && { insurance_included: req.body.insurance_included }),
    ...(req.body.insurance_details && { insurance_details: req.body.insurance_details }),
    ...(req.body.safety_measures && Array.isArray(req.body.safety_measures) && { safety_measures: req.body.safety_measures }),
    ...(req.body.emergency_procedures && { emergency_procedures: req.body.emergency_procedures }),
    ...(req.body.medical_requirements && { medical_requirements: req.body.medical_requirements }),
    ...(req.body.languages_offered && Array.isArray(req.body.languages_offered) && { languages_offered: req.body.languages_offered }),
    ...(req.body.guide_info && { guide_info: req.body.guide_info }),
    ...(req.body.weather_dependency !== undefined && { weather_dependency: req.body.weather_dependency }),
    ...(req.body.weather_notes && { weather_notes: req.body.weather_notes }),
    ...(req.body.what_to_wear && { what_to_wear: req.body.what_to_wear }),
    ...(req.body.additional_notes && { additional_notes: req.body.additional_notes }),
    ...(req.body.terms_and_conditions && { terms_and_conditions: req.body.terms_and_conditions }),
    ...(req.body.status && { status: req.body.status }),
    ...(req.body.is_featured !== undefined && { is_featured: req.body.is_featured }),
    ...(req.body.is_active !== undefined && { is_active: req.body.is_active }),
    ...(req.body.tags && Array.isArray(req.body.tags) && { tags: req.body.tags }),
    ...(req.body.category && { category: req.body.category }),
  };

  const itinerary = await itineraryService.create(itineraryPayload);
  
  // Add images if provided
  if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
    await itineraryService.addCloudinaryImages(itinerary.id, imageUrls);
  }
  
  // Add videos if provided
  if (videoUrls && Array.isArray(videoUrls) && videoUrls.length > 0) {
    await itineraryService.addVideos(itinerary.id, videoUrls);
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
export const addCloudinaryImagesToItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { imageUrls } = req.body;

  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    throw new BadRequestError('imageUrls array is required');
  }

  const updatedItinerary = await itineraryService.addCloudinaryImages(id, imageUrls);
  if (!updatedItinerary) throw new NotFoundError('Itinerary not found');

  const presentable = await presentItineraryImages(
    updatedItinerary as ItineraryWithImagesPayload,
    false,
  );
  ResponseHandler.success(res, 200, 'Cloudinary images added successfully', presentable);
};

export const updateItinerary = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  
  // Only include fields that are actually provided to avoid overriding with null/undefined
  const updateData: Prisma.ItineraryUpdateInput = {};

  // Handle each field individually to avoid null overrides
  if (req.body.title !== undefined) updateData.title = req.body.title;
  if (req.body.activity !== undefined) updateData.activity = req.body.activity;
  if (req.body.description !== undefined) updateData.description = req.body.description;
  if (req.body.location !== undefined) updateData.location = req.body.location;
  if (req.body.date) {
    try {
      updateData.date = normalizeDate(req.body.date);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Invalid date format for update'
      );
    }
  }
  if (req.body.price !== undefined) updateData.price = req.body.price ? Number(req.body.price) : null;
  if (req.body.duration_days !== undefined) updateData.duration_days = req.body.duration_days ? Number(req.body.duration_days) : null;
  if (req.body.duration_hours !== undefined) updateData.duration_hours = req.body.duration_hours ? Number(req.body.duration_hours) : null;
  if (req.body.start_time !== undefined) updateData.start_time = req.body.start_time;
  if (req.body.end_time !== undefined) updateData.end_time = req.body.end_time;
  if (req.body.is_multi_day !== undefined) updateData.is_multi_day = req.body.is_multi_day;
  if (req.body.schedule_details !== undefined) updateData.schedule_details = req.body.schedule_details;
  if (req.body.min_participants !== undefined) updateData.min_participants = req.body.min_participants ? Number(req.body.min_participants) : null;
  if (req.body.max_participants !== undefined) updateData.max_participants = req.body.max_participants ? Number(req.body.max_participants) : null;
  if (req.body.available_slots !== undefined) updateData.available_slots = req.body.available_slots ? Number(req.body.available_slots) : null;
  if (req.body.allows_individuals !== undefined) updateData.allows_individuals = req.body.allows_individuals;
  if (req.body.allows_groups !== undefined) updateData.allows_groups = req.body.allows_groups;
  if (req.body.group_discount_percent !== undefined) updateData.group_discount_percent = req.body.group_discount_percent ? Number(req.body.group_discount_percent) : null;
  if (req.body.group_min_size !== undefined) updateData.group_min_size = req.body.group_min_size ? Number(req.body.group_min_size) : null;
  if (req.body.booking_deadline !== undefined) updateData.booking_deadline = req.body.booking_deadline;
  if (req.body.inclusions !== undefined) updateData.inclusions = req.body.inclusions;
  if (req.body.exclusions !== undefined) updateData.exclusions = req.body.exclusions;
  if (req.body.provided_equipment !== undefined) updateData.provided_equipment = req.body.provided_equipment;
  if (req.body.required_items !== undefined) updateData.required_items = req.body.required_items;
  if (req.body.meals_included !== undefined) updateData.meals_included = req.body.meals_included;
  if (req.body.meal_types !== undefined) updateData.meal_types = req.body.meal_types;
  if (req.body.food_options !== undefined) updateData.food_options = req.body.food_options;
  if (req.body.can_buy_food_onsite !== undefined) updateData.can_buy_food_onsite = req.body.can_buy_food_onsite;
  if (req.body.can_bring_own_food !== undefined) updateData.can_bring_own_food = req.body.can_bring_own_food;
  if (req.body.dietary_accommodations !== undefined) updateData.dietary_accommodations = req.body.dietary_accommodations;
  if (req.body.transport_included !== undefined) updateData.transport_included = req.body.transport_included;
  if (req.body.transport_type !== undefined) updateData.transport_type = req.body.transport_type;
  if (req.body.pickup_locations !== undefined) updateData.pickup_locations = req.body.pickup_locations;
  if (req.body.dropoff_locations !== undefined) updateData.dropoff_locations = req.body.dropoff_locations;
  if (req.body.allows_own_transport !== undefined) updateData.allows_own_transport = req.body.allows_own_transport;
  if (req.body.parking_available !== undefined) updateData.parking_available = req.body.parking_available;
  if (req.body.transport_notes !== undefined) updateData.transport_notes = req.body.transport_notes;
  if (req.body.meeting_point !== undefined) updateData.meeting_point = req.body.meeting_point;
  if (req.body.meeting_point_lat !== undefined) updateData.meeting_point_lat = req.body.meeting_point_lat ? Number(req.body.meeting_point_lat) : null;
  if (req.body.meeting_point_lng !== undefined) updateData.meeting_point_lng = req.body.meeting_point_lng ? Number(req.body.meeting_point_lng) : null;
  if (req.body.end_point !== undefined) updateData.end_point = req.body.end_point;
  if (req.body.end_point_lat !== undefined) updateData.end_point_lat = req.body.end_point_lat ? Number(req.body.end_point_lat) : null;
  if (req.body.end_point_lng !== undefined) updateData.end_point_lng = req.body.end_point_lng ? Number(req.body.end_point_lng) : null;
  if (req.body.location_details !== undefined) updateData.location_details = req.body.location_details;
  if (req.body.difficulty_level !== undefined) updateData.difficulty_level = req.body.difficulty_level;
  if (req.body.fitness_level_required !== undefined) updateData.fitness_level_required = req.body.fitness_level_required;
  if (req.body.min_age !== undefined) updateData.min_age = req.body.min_age ? Number(req.body.min_age) : null;
  if (req.body.max_age !== undefined) updateData.max_age = req.body.max_age ? Number(req.body.max_age) : null;
  if (req.body.age_restrictions_notes !== undefined) updateData.age_restrictions_notes = req.body.age_restrictions_notes;
  if (req.body.accessibility_info !== undefined) updateData.accessibility_info = req.body.accessibility_info;
  if (req.body.price_per_person !== undefined) updateData.price_per_person = req.body.price_per_person ? Number(req.body.price_per_person) : null;
  if (req.body.price_per_group !== undefined) updateData.price_per_group = req.body.price_per_group ? Number(req.body.price_per_group) : null;
  if (req.body.deposit_required !== undefined) updateData.deposit_required = req.body.deposit_required ? Number(req.body.deposit_required) : null;
  if (req.body.deposit_percentage !== undefined) updateData.deposit_percentage = req.body.deposit_percentage ? Number(req.body.deposit_percentage) : null;
  if (req.body.payment_methods !== undefined) updateData.payment_methods = req.body.payment_methods;
  if (req.body.currency !== undefined) updateData.currency = req.body.currency;
  if (req.body.refund_policy !== undefined) updateData.refund_policy = req.body.refund_policy;
  if (req.body.cancellation_policy !== undefined) updateData.cancellation_policy = req.body.cancellation_policy;
  if (req.body.insurance_included !== undefined) updateData.insurance_included = req.body.insurance_included;
  if (req.body.insurance_details !== undefined) updateData.insurance_details = req.body.insurance_details;
  if (req.body.safety_measures !== undefined) updateData.safety_measures = req.body.safety_measures;
  if (req.body.emergency_procedures !== undefined) updateData.emergency_procedures = req.body.emergency_procedures;
  if (req.body.medical_requirements !== undefined) updateData.medical_requirements = req.body.medical_requirements;
  if (req.body.languages_offered !== undefined) updateData.languages_offered = req.body.languages_offered;
  if (req.body.guide_info !== undefined) updateData.guide_info = req.body.guide_info;
  if (req.body.weather_dependency !== undefined) updateData.weather_dependency = req.body.weather_dependency;
  if (req.body.weather_notes !== undefined) updateData.weather_notes = req.body.weather_notes;
  if (req.body.what_to_wear !== undefined) updateData.what_to_wear = req.body.what_to_wear;
  if (req.body.additional_notes !== undefined) updateData.additional_notes = req.body.additional_notes;
  if (req.body.terms_and_conditions !== undefined) updateData.terms_and_conditions = req.body.terms_and_conditions;
  if (req.body.status !== undefined) updateData.status = req.body.status;
  if (req.body.is_featured !== undefined) updateData.is_featured = req.body.is_featured;
  if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active;
  if (req.body.tags !== undefined) updateData.tags = req.body.tags;
  if (req.body.category !== undefined) updateData.category = req.body.category;

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
