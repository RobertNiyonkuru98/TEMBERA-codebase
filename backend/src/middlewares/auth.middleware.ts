import { asyncWrapper } from '@/utils/async.wrapper';
import { UnauthorizedError } from '@/utils/http-error';
import { logger } from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Tembera@2026';

export const authenticateToken = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) throw new UnauthorizedError('Access denied');

    try {
      const verified = jwt.verify(token, JWT_SECRET);
      (req as any).user = verified;
      next();
    } catch (error) {
      logger.error(
        "AuthMiddleware.ts authenticateToken error verifying token:",
        error
      );
      throw new UnauthorizedError('Invalid token');
    }
  }
);

export const verifyAdmin = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedError('Admin access required');
    }
    next();
  }
);

export const verifyCompany = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== 'company') {
      throw new UnauthorizedError('Company access required');
    }
    next();
  }
);