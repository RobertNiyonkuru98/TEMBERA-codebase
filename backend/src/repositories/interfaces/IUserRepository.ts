import { User, Prisma } from '@prisma/client';

export interface IUserRepository {
  // Create
  create(data: Prisma.UserCreateInput): Promise<User>;

  // Read
  findById(id: bigint): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(skip?: number, take?: number): Promise<User[]>;
  findWithBookings(id: bigint): Promise<User | null>;
  findWithCompanies(id: bigint): Promise<User | null>;

  // Update
  update(id: bigint, data: Prisma.UserUpdateInput): Promise<User>;
  updateEmail(id: bigint, email: string): Promise<User>;
  updatePassword(id: bigint, password: string): Promise<User>;

  // Count
  count(): Promise<number>;
}
