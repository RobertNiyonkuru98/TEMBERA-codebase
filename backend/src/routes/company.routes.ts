import { Router } from 'express';
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from '../controllers/CompanyController';
import { asyncWrapper } from '@/utils/async.wrapper';

const router = Router();

router.get('/', asyncWrapper(getAllCompanies));
router.get('/:id', asyncWrapper(getCompanyById));
router.post('/', asyncWrapper(createCompany));
router.put('/:id', asyncWrapper(updateCompany));
router.delete('/:id', asyncWrapper(deleteCompany));

export default router;
