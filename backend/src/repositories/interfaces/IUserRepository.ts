import { User, Prisma } from '@prisma/client';

export interface IUserRepository {
  // Create
  create(data: Prisma.UserCreateInput): Promise<User>;

  // Read
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(skip?: number, take?: number): Promise<User[]>;
  findWithBookings(id: string): Promise<User | null>;
  findWithCompanies(id: string): Promise<User | null>;

  // Update
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  updateEmail(id: string, email: string): Promise<User>;
  updatePassword(id: string, password: string): Promise<User>;

  // Delete
  delete(id: string): Promise<void>;

  // Count
  count(): Promise<number>;
}
