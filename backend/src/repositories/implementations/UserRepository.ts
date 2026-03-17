import { User, Prisma, Role } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { IUserRepository } from '../interfaces/IUserRepository';
import { BadRequestError, ConflictError, NotFoundError } from '@/utils/http-error';

type UserWithRoles = User & { roles: Role[] };

const VALID_ROLES = ['user', 'admin', 'company', 'visitor'];
const VALID_ROLE_STATUSES = ['active', 'inactive'];

export class UserRepository implements IUserRepository {
  // Create
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data });

      await tx.role.create({
        data: {
          user_id: user.id,
          access_level: 'user',
          access_status: 'active',
        },
      });

      return user;
    });

    return createdUser;
  }

  // Read
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findWithRolesByEmail(email: string): Promise<UserWithRoles | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
  }

  async findAll(skip?: number, take?: number): Promise<User[]> {
    return await prisma.user.findMany({
      skip,
      take,
      include: { roles: true },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findWithBookings(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });
  }

  async findWithCompanies(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        companies: true,
      },
    });
  }

  // Update
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateEmail(id: string, email: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { email },
    });
  }
  async updateRole(id: string, role: string, accessStatus: string): Promise<UserWithRoles> {
    if (!id?.trim()) {
      throw new BadRequestError('User id is required');
    }

    const normalizedRole = role?.trim().toLowerCase();
    if (!normalizedRole || !VALID_ROLES.includes(normalizedRole)) {
      throw new BadRequestError('Invalid role. Allowed roles: user, admin, company, visitor');
    }

    const normalizedStatus = accessStatus?.trim().toLowerCase();
    if (!normalizedStatus || !VALID_ROLE_STATUSES.includes(normalizedStatus)) {
      throw new BadRequestError('Invalid role status. Allowed statuses: active, inactive');
    }

    const findUser = await prisma.user.findUnique({ where: { id } });
    if (!findUser) {
      throw new NotFoundError('User not found');
    }

    const existingRole = await prisma.role.findUnique({
      where: {
        user_id_access_level: {
          user_id: id,
          access_level: normalizedRole,
        },
      },
    });

    if (existingRole && existingRole.access_status === normalizedStatus) {
      throw new ConflictError(
        `User already has the ${normalizedRole} role with ${normalizedStatus} status`,
      );
    }

    await prisma.role.upsert({
      where: {
        user_id_access_level: {
          user_id: id,
          access_level: normalizedRole,
        },
      },
      update: {
        access_status: normalizedStatus,
      },
      create: {
        user_id: id,
        access_level: normalizedRole,
        access_status: normalizedStatus,
      },
    });

    const userWithRole = await prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!userWithRole) {
      throw new NotFoundError('User not found');
    }

    return userWithRole;
  }

  async findRolesByUserId(id: string): Promise<Role[]> {
    if (!id?.trim()) {
      throw new BadRequestError('User id is required');
    }

    return await prisma.role.findMany({
      where: { user_id: id },
      orderBy: { access_level: 'asc' },
    });
  }

  async switchRole(id: string, role: string): Promise<string> {
    if (!id?.trim()) {
      throw new BadRequestError('User id is required');
    }

    const normalizedRole = role?.trim().toLowerCase();
    if (!normalizedRole || !VALID_ROLES.includes(normalizedRole)) {
      throw new BadRequestError('Invalid role. Allowed roles: user, admin, company, visitor');
    }

    const roleAssignment = await prisma.role.findFirst({
      where: {
        user_id: id,
        access_level: normalizedRole,
        access_status: 'active',
      },
    });

    if (!roleAssignment) {
      throw new NotFoundError(`Active role ${normalizedRole} is not assigned to this user`);
    }

    return normalizedRole;
  }
  async updatePassword(id: string, password: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  // Delete
  async delete(id: string): Promise<void> {
    await prisma.role.deleteMany({ where: { user_id: id } });
    await prisma.user.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return await prisma.user.count();
  }
}
