import { Router } from 'express';
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from '../controllers/CompanyController';
import { asyncWrapper } from '@/utils/async.wrapper';
import { authenticateToken } from '@/middlewares/auth.middleware';

const router = Router();

router.get('/', asyncWrapper(getAllCompanies));
router.get('/:id', asyncWrapper(getCompanyById));
router.post('/', authenticateToken, asyncWrapper(createCompany));
router.put('/:id', authenticateToken, asyncWrapper(updateCompany));
router.delete('/:id', authenticateToken, asyncWrapper(deleteCompany));

export default router;
