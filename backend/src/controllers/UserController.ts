import { UserService } from '@/services/UserService';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@/utils/http-error';
import { JWT_SECRET } from '@/utils/constants';
import { ResponseHandler } from '@/utils/response';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/db/prisma.client';
import { Role } from '@prisma/client';

const userService = new UserService();

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateUserId(id: string): void {
  if (!id || !UUID_REGEX.test(id)) {
    throw new BadRequestError('Invalid user id format');
  }
}

function getRequestUser(req: Request): { userId: string; email: string; roles: string[] } {
  const user = (req as any).user as { userId?: string; email?: string; } | undefined;
  if (!user?.userId || !user?.email) {
    console.log('Invalid authentication payload:', user);
    throw new UnauthorizedError('Invalid authentication payload');
  }
const userRecord: any = prisma.user.findUnique({ where: { id: user.userId,  }, include: { roles: true } }).then(record => {
  return record;
});
 const activeRoles =
    userRecord.roles
      ?.filter((role: Role) => role.access_status === 'active')
      .map((role: any) => role.access_level) || [];
console.log('User record from database:',{...userRecord.roles}, {
  userId: user.userId,
    email: user.email,
    roles: activeRoles.length ? activeRoles : ["user"], // fallback
});
  return {
    userId: user.userId,
    email: user.email,
    roles: activeRoles.length ? activeRoles : ["user"], // fallback
  };
}

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAll();
  ResponseHandler.success(res, 200, 'Users retrieved successfully', users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  validateUserId(id);
  const user = await userService.getById(id);
  if (!user) throw new NotFoundError('User not found');
  return ResponseHandler.success(res, 200, 'User retrieved successfully', user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  return ResponseHandler.success(res, 201, 'User created successfully', user);
};

export const updateUser = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  validateUserId(id);
  const user = await userService.update(id, req.body);
  if (!user) throw new NotFoundError('User not found');
  return ResponseHandler.success(res, 200, 'User updated successfully', user);
};

export const alterUserRole = async (req: Request, res: Response) => {
  const requestUser = getRequestUser(req);
  if (!requestUser.roles.includes('admin')) {
    throw new UnauthorizedError('Only admin users can manage roles');
  }

  const id = String(req.params.id);
  validateUserId(id);
  const { role, access_status } = req.body as { role?: string; access_status?: string };
  if (!role || typeof role !== 'string') {
    throw new BadRequestError('role is required and must be a string');
  }

  if (!access_status || typeof access_status !== 'string') {
    throw new BadRequestError('access_status is required and must be a string');
  }

  const user = await userService.updateRole(id, { role, accessStatus: access_status });

  if (!user) throw new NotFoundError('User not found');
  return ResponseHandler.success(res, 200, 'User role updated successfully', user);
}

export const getMyRoles = async (req: Request, res: Response) => {
  const requestUser = getRequestUser(req);

  const roles = await userService.getRoles(requestUser.userId);
  const activeRoles = roles
    .filter((role) => role.access_status === 'active')
    .map((role) => role.access_level);

  return ResponseHandler.success(res, 200, 'User roles retrieved successfully', {
    user_id: requestUser.userId,
    active_role: requestUser.roles,
    roles,
    active_roles: activeRoles,
  });
};

export const switchMyRole = async (req: Request, res: Response) => {
  const requestUser = getRequestUser(req);
  const { role } = req.body as { role?: string };

  if (!role || typeof role !== 'string') {
    throw new BadRequestError('role is required and must be a string');
  }

  const switchedRole = await userService.switchRole(requestUser.userId, role);

  const roles = await userService.getRoles(requestUser.userId);
  const activeRoles = roles
    .filter((assignedRole) => assignedRole.access_status === 'active')
    .map((assignedRole) => assignedRole.access_level);

  const token = jwt.sign(
    {
      userId: requestUser.userId,
      email: requestUser.email,
      role: switchedRole,
      roles: activeRoles,
    },
    JWT_SECRET,
    { expiresIn: '1d' },
  );

  return ResponseHandler.success(res, 200, 'Active role switched successfully', {
    token,
    active_role: switchedRole,
    active_roles: activeRoles,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  validateUserId(id);
  await userService.delete(id);
  return ResponseHandler.success(res, 200, 'User deleted successfully', null);
};
