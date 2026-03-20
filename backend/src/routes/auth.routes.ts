import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { ResponseHandler } from '@/utils/response';
import { asyncWrapper } from '@/utils/async.wrapper';

const router = Router();
const authController = new AuthController();

router.post('/register', asyncWrapper(authController.register));
router.post('/login', asyncWrapper(authController.login));
router.get('/verify', authenticateToken, asyncWrapper(
    async (req, res, _next) => {
        ResponseHandler.success(res, 200, 'Token is valid', (req as any).user);
    }));

export default router;