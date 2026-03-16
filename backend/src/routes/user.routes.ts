import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/UserController';
import { asyncWrapper } from '@/utils/async.wrapper';

const router = Router();

router.get('/', asyncWrapper(getAllUsers));
router.get('/:id', asyncWrapper(getUserById));
router.post('/', asyncWrapper(createUser));
router.put('/:id', asyncWrapper(updateUser));
router.delete('/:id', asyncWrapper(deleteUser));

export default router;