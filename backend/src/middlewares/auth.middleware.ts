import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Tembera@2026';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Getting Bearer TOKEN

    if (!token) {
        return res.status(401).json({message: 'Access denied'});
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        (req as any).user = verified;
        return next();
    } catch (error) {
        return res.status(403).json({message: 'Invalid token'});
    }
}