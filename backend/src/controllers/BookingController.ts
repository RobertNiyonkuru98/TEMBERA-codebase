import { BookingService } from '@/services/BookingService';
import prisma from '@/db/prisma.client';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/http-error';
import { ResponseHandler } from '@/utils/response';
import { normalizeDate } from '@/utils/date.validator';
import { Request, Response } from 'express';

const bookingService = new BookingService();

type AuthUser = {
  userId: string;
  role: string;
};

function getAuthUser(req: Request): AuthUser {
  const user = (req as Request & { user?: AuthUser }).user;
  if (!user?.userId || !user?.role) {
    throw new UnauthorizedError('Access denied');
  }

  return user;
}

async function assertBookingAccess(req: Request, bookingId: string) {
  const authUser = getAuthUser(req);
  const booking = await bookingService.getById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (authUser.role === 'admin') {
    return booking;
  }

  if (authUser.role === 'user' && booking.user_id === authUser.userId) {
    return booking;
  }

  if (authUser.role === 'company') {
    const companyBookings = await bookingService.getAllForCompanyOwner(authUser.userId);
    const hasAccess = companyBookings.some((item) => item.id === booking.id);
    if (hasAccess) {
      return booking;
    }
  }

  throw new UnauthorizedError('Unauthorized');
}

function mapMembersInput(
  members: unknown
): Array<{ name: string; email?: string; phone?: string }> | undefined {
  if (!Array.isArray(members)) {
    return undefined;
  }

  return members.map((member) => {
    const value = member as {
      name?: string;
      email?: string;
      phone?: string;
      phoneNumber?: string;
    };

    return {
      name: value.name ?? '',
      email: value.email,
      phone: value.phone ?? value.phoneNumber,
    };
  });
}

// Booking endpoints
export const getAllBookings = async (req: Request, res: Response) => {
  const authUser = getAuthUser(req);

  const bookings =
    authUser.role === 'admin'
      ? await bookingService.getAll()
      : authUser.role === 'company'
        ? await bookingService.getAllForCompanyOwner(authUser.userId)
        : await bookingService.getAllForUser(authUser.userId);

  return ResponseHandler.success(res, 200, 'Bookings retrieved successfully', bookings);
};

export const getBookingById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const booking = await assertBookingAccess(req, id);
  return ResponseHandler.success(res, 200, 'Booking retrieved successfully', booking);
};

export const createBooking = async (req: Request, res: Response) => {
  const authUser = getAuthUser(req);

  if (authUser.role === 'company') {
    throw new UnauthorizedError('Company users cannot create bookings');
  }

  if (!req.body.date) {
    throw new BadRequestError('Date is required to create a booking');
  }

  const requestedUserId = String(req.body.user_id ?? authUser.userId);
  if (authUser.role === 'user' && requestedUserId !== authUser.userId) {
    throw new UnauthorizedError('Users can only create their own bookings');
  }
    const normalizedDate = normalizeDate(req.body.date);
    const bookingType = String(req.body.type ?? 'personal').toLowerCase();

    const booking = await bookingService.create({
      user_id: requestedUserId,
      itineraryId: req.body.itineraryId ?? req.body.itinerary_id,
      type: bookingType,
      description: req.body.description,
      status: req.body.status,
      date: normalizedDate,
      members: mapMembersInput(req.body.members),
    });

    return ResponseHandler.success(res, 201, 'Booking created successfully', booking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const currentBooking = await assertBookingAccess(req, id);

  const nextType = String(req.body.type ?? currentBooking.type ?? 'personal').toLowerCase();
  const nextDate = req.body.date ? normalizeDate(req.body.date) : undefined;

  const booking = await bookingService.update(id, {
    itineraryId: req.body.itineraryId ?? req.body.itinerary_id,
    type: nextType,
    description: req.body.description,
    status: req.body.status,
    date: nextDate,
    members: mapMembersInput(req.body.members),
  });

  if (!booking) throw new NotFoundError('Booking not found');
  return ResponseHandler.success(res, 200, 'Booking updated successfully', booking);
};

export const deleteBooking = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await assertBookingAccess(req, id);
  const deleted = await bookingService.delete(id);
  if (!deleted) throw new NotFoundError('Booking not found');
  return ResponseHandler.success(res, 200, 'Booking deleted successfully', null);
};

export const getBookingMembers = async (req: Request, res: Response) => {
  const bookingId = String(req.params.bookingId);
  await assertBookingAccess(req, bookingId);

  const members = await bookingService.getMembersByBookingId(bookingId);
  return ResponseHandler.success(res, 200, 'Booking members retrieved successfully', members);
};

export const createBookingMember = async (req: Request, res: Response) => {
  const bookingId = String(req.params.bookingId);
  await assertBookingAccess(req, bookingId);

  const member = await bookingService.createMember(bookingId, {
    name: String(req.body.name ?? ''),
    email: req.body.email,
    phone: req.body.phone ?? req.body.phoneNumber,
  });

  return ResponseHandler.success(res, 201, 'Booking member created successfully', member);
};

export const updateBookingMember = async (req: Request, res: Response) => {
  const memberId = String(req.params.memberId);
  const member = await prisma.bookingMember.findUnique({ where: { id: memberId } });
  if (!member) {
    throw new NotFoundError('Booking member not found');
  }

  await assertBookingAccess(req, member.booking_id);

  const updatedMember = await bookingService.updateMember(memberId, {
    name: String(req.body.name ?? ''),
    email: req.body.email,
    phone: req.body.phone ?? req.body.phoneNumber,
  });

  if (!updatedMember) {
    throw new NotFoundError('Booking member not found');
  }

  return ResponseHandler.success(res, 200, 'Booking member updated successfully', updatedMember);
};

export const deleteBookingMember = async (req: Request, res: Response) => {
  const memberId = String(req.params.memberId);
  const member = await prisma.bookingMember.findUnique({ where: { id: memberId } });
  if (!member) {
    throw new NotFoundError('Booking member not found');
  }

  await assertBookingAccess(req, member.booking_id);

  const deleted = await bookingService.deleteMember(memberId);
  if (!deleted) {
    throw new NotFoundError('Booking member not found');
  }

  return ResponseHandler.success(res, 200, 'Booking member deleted successfully', null);
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
