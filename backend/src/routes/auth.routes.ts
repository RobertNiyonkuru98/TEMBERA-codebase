import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { authenticateToken } from '@/middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: (req as any).user });
});

export default router;