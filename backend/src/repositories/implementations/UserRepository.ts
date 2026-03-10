import { User, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  // Create
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({ data });
  }

  // Read
  async findById(id: bigint): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(skip?: number, take?: number): Promise<User[]> {
    return await prisma.user.findMany({
      skip,
      take,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findWithBookings(id: bigint): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });
  }

  async findWithCompanies(id: bigint): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        companies: true,
      },
    });
  }

  // Update
  async update(id: bigint, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateEmail(id: bigint, email: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { email },
    });
  }

  async updatePassword(id: bigint, password: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  // Count
  async count(): Promise<number> {
    return await prisma.user.count();
  }
}
