import { Booking, BookingMember, Prisma } from '@prisma/client';

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    user: true;
    itinerary: true;
    members: true;
    items: {
      include: {
        itinerary: {
          include: {
            company: true;
          };
        };
      };
    };
  };
}>;

export type BookingMemberPayload = {
  name: string;
  email?: string;
  phone?: string;
};

export type BookingCreatePayload = {
  user_id: string;
  itineraryId?: string;
  type: string;
  description?: string;
  status: string;
  date: string;
  members?: BookingMemberPayload[];
};

export type BookingUpdatePayload = {
  itineraryId?: string;
  type?: string;
  description?: string;
  status?: string;
  date?: string;
  members?: BookingMemberPayload[];
};

export interface IBookingRepository {
  // BookingItem methods
  findAllItems(skip?: number, take?: number): Promise<any[]>;
  findItemById(id: string): Promise<any | null>;
  createItem(data: any): Promise<any>;
  updateItem(id: string, data: any): Promise<any>;
  deleteItem(id: string): Promise<void>;
  // Create
  create(data: BookingCreatePayload): Promise<BookingWithRelations>;

  // Read
  findById(id: string): Promise<BookingWithRelations | null>;
  findByUserId(userId: string): Promise<BookingWithRelations[]>;
  findByStatus(status: string): Promise<BookingWithRelations[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]>;
  findAll(skip?: number, take?: number): Promise<BookingWithRelations[]>;
  findWithUser(id: string): Promise<BookingWithRelations | null>;
  findWithItems(id: string): Promise<BookingWithRelations | null>;
  findComplete(id: string): Promise<BookingWithRelations | null>;
  findByCompanyOwnerId(ownerId: string): Promise<BookingWithRelations[]>;

  // Update
  update(id: string, data: BookingUpdatePayload): Promise<BookingWithRelations>;
  updateStatus(id: string, status: string): Promise<Booking>;

  // Delete
  delete(id: string): Promise<void>;

  // Count
  count(): Promise<number>;
  countByStatus(status: string): Promise<number>;

  // BookingMember methods
  findMembersByBookingId(bookingId: string): Promise<BookingMember[]>;
  createMember(bookingId: string, data: BookingMemberPayload): Promise<BookingMember>;
  updateMember(id: string, data: BookingMemberPayload): Promise<BookingMember>;
  deleteMember(id: string): Promise<void>;
}
