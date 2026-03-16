import { UserService } from '@/services/UserService';
import { NotFoundError } from '@/utils/http-error';
import { ResponseHandler } from '@/utils/response';
import { Request, Response } from 'express';

const userService = new UserService();

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAll();
  ResponseHandler.success(res, 200, 'Users retrieved successfully', users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
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
  const user = await userService.update(id, req.body);
  if (!user) throw new NotFoundError('User not found');
  return ResponseHandler.success(res, 200, 'User updated successfully', user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await userService.delete(id);
  if (!deleted) throw new NotFoundError('User not found');
  return ResponseHandler.success(res, 200, 'User deleted successfully', null);
};
