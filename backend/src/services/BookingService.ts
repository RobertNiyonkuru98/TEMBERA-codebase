import { BookingRepository } from '../repositories/implementations/BookingRepository';
import { BookingMember, Prisma } from '@prisma/client';
import {
  BookingCreatePayload,
  BookingMemberPayload,
  BookingUpdatePayload,
  BookingWithRelations,
} from '@/repositories/interfaces/IBookingRepository';
import { BadRequestError, ConflictError } from '@/utils/http-error';

export class BookingService {
  private bookingRepository = new BookingRepository();

  private normalizeText(value?: string): string {
    return (value ?? '').trim().toLowerCase();
  }

  private normalizeDateOnly(value: string): string {
    return new Date(value).toISOString().slice(0, 10);
  }

  private membersFingerprint(members: BookingMemberPayload[]): string[] {
    return members
      .map((member) => {
        const name = this.normalizeText(member.name);
        const email = this.normalizeText(member.email);
        const phone = this.normalizeText(member.phone);
        return `${name}|${email}|${phone}`;
      })
      .sort();
  }

  private sameMembers(left: BookingMemberPayload[], right: BookingMemberPayload[]): boolean {
    if (left.length !== right.length) {
      return false;
    }

    const leftFingerprint = this.membersFingerprint(left);
    const rightFingerprint = this.membersFingerprint(right);

    return leftFingerprint.every((value, index) => value === rightFingerprint[index]);
  }

  private isDuplicateBooking(candidate: BookingWithRelations, payload: BookingCreatePayload): boolean {
    const sameItinerary = (candidate.itinerary_id ?? '') === (payload.itineraryId ?? '');
    const sameType = candidate.type === payload.type;
    const sameDescription =
      this.normalizeText(candidate.description ?? undefined) ===
      this.normalizeText(payload.description);
    const sameStatus = candidate.status === payload.status;
    const sameDate =
      this.normalizeDateOnly(candidate.date.toISOString()) === this.normalizeDateOnly(payload.date);

    if (!(sameItinerary && sameType && sameDescription && sameStatus && sameDate)) {
      return false;
    }

    const candidateMembers = (candidate.members ?? []).map((member) => ({
      name: member.name,
      email: member.email ?? undefined,
      phone: member.phone ?? undefined,
    }));

    const payloadMembers = payload.members ?? [];
    return this.sameMembers(candidateMembers, payloadMembers);
  }

  private normalizeMembers(members?: BookingMemberPayload[]): BookingMemberPayload[] {
    return (members ?? [])
      .map((member) => ({
        name: member.name?.trim(),
        email: member.email?.trim() || undefined,
        phone: member.phone?.trim() || undefined,
      }))
      .filter((member) => Boolean(member.name));
  }

  private validatePayload(type: string, members: BookingMemberPayload[]) {
    if (type !== 'personal' && type !== 'group') {
      throw new BadRequestError('Booking type must be personal or group');
    }

    if (type === 'group' && members.length === 0) {
      throw new BadRequestError('Group booking requires at least one member');
    }
  }

  // Booking methods
  async getAll(): Promise<BookingWithRelations[]> {
    return this.bookingRepository.findAll();
  }

  async getAllForUser(userId: string): Promise<BookingWithRelations[]> {
    return this.bookingRepository.findByUserId(userId);
  }

  async getAllForCompanyOwner(ownerId: string): Promise<BookingWithRelations[]> {
    return this.bookingRepository.findByCompanyOwnerId(ownerId);
  }

  async getById(id: string): Promise<BookingWithRelations | null> {
    return this.bookingRepository.findById(id);
  }

  async create(data: {
    user_id: string;
    itineraryId?: string;
    type?: string;
    description?: string;
    status?: string;
    date: string;
    members?: BookingMemberPayload[];
  }): Promise<BookingWithRelations> {
    const type = (data.type ?? 'personal').toLowerCase();
    const members = type === 'group' ? this.normalizeMembers(data.members) : [];

    this.validatePayload(type, members);

    const createPayload: BookingCreatePayload = {
      user_id: data.user_id,
      itineraryId: data.itineraryId,
      type,
      description: data.description,
      status: data.status ?? 'pending',
      date: data.date,
      members,
    };

    const existingBookings = await this.bookingRepository.findByUserId(data.user_id);
    const duplicateExists = existingBookings.some((booking) =>
      this.isDuplicateBooking(booking, createPayload)
    );

    if (duplicateExists) {
      throw new ConflictError('Duplicate booking detected. This booking already exists.');
    }

    return this.bookingRepository.create(createPayload);
  }

  async update(
    id: string,
    data: {
      itineraryId?: string;
      type?: string;
      description?: string;
      status?: string;
      date?: string;
      members?: BookingMemberPayload[];
    }
  ): Promise<BookingWithRelations | null> {
    try {
      const type = data.type ? data.type.toLowerCase() : undefined;
      const shouldProcessMembers = Array.isArray(data.members);
      const members = shouldProcessMembers
        ? type === 'group'
          ? this.normalizeMembers(data.members)
          : []
        : undefined;

      if (type && members) {
        this.validatePayload(type, members);
      }

      const updatePayload: BookingUpdatePayload = {
        itineraryId: data.itineraryId,
        type,
        description: data.description,
        status: data.status,
        date: data.date,
        members,
      };

      return await this.bookingRepository.update(id, updatePayload);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.bookingRepository.delete(id);
      return true;
    } catch {
      return false;
    }
  }

  async getMembersByBookingId(bookingId: string): Promise<BookingMember[]> {
    return this.bookingRepository.findMembersByBookingId(bookingId);
  }

  async createMember(bookingId: string, data: BookingMemberPayload): Promise<BookingMember> {
    if (!data.name?.trim()) {
      throw new BadRequestError('Member name is required');
    }

    return this.bookingRepository.createMember(bookingId, {
      name: data.name.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
    });
  }

  async updateMember(id: string, data: BookingMemberPayload): Promise<BookingMember | null> {
    try {
      if (!data.name?.trim()) {
        throw new BadRequestError('Member name is required');
      }

      return await this.bookingRepository.updateMember(id, {
        name: data.name.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
      });
    } catch {
      return null;
    }
  }

  async deleteMember(id: string): Promise<boolean> {
    try {
      await this.bookingRepository.deleteMember(id);
      return true;
    } catch {
      return false;
    }
  }

  // BookingItem methods
  async getAllItems() {
    return this.bookingRepository.findAllItems();
  }

  async getItemById(id: string) {
    return this.bookingRepository.findItemById(id);
  }

  async createItem(data: Prisma.BookingItemCreateInput) {
    return this.bookingRepository.createItem(data);
  }

  async updateItem(id: string, data: Prisma.BookingItemUpdateInput) {
    try {
      return await this.bookingRepository.updateItem(id, data);
    } catch {
      return null;
    }
  }

  async deleteItem(id: string) {
    try {
      await this.bookingRepository.deleteItem(id);
      return true;
    } catch {
      return false;
    }
  }
}
