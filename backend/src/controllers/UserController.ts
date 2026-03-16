import { UserService } from '@/services/UserService';
import { Request, Response } from 'express';

const userService = new UserService();

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAll();
  return res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getById(req.params.id as string);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  return res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await userService.update(req.params.id as string, req.body);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const deleted = await userService.delete(req.params.id as string);
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  return res.status(204).send();
};
