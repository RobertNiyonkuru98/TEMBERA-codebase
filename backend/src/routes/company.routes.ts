import { Router } from 'express';
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from '../controllers/CompanyController';
import {
    createOrUpdateRating,
    getCompanyRatings,
    getCompanyRatingStats,
    getUserRatingForCompany,
    getUserRatings,
    deleteRating,
} from '../controllers/CompanyRatingController';
import { asyncWrapper } from '@/utils/async.wrapper';
import { authenticateToken } from '@/middlewares/auth.middleware';

const router = Router();

// Company CRUD routes
router.get('/', asyncWrapper(getAllCompanies));
router.get('/:id', asyncWrapper(getCompanyById));
router.post('/', authenticateToken, asyncWrapper(createCompany));
router.put('/:id', authenticateToken, asyncWrapper(updateCompany));
router.delete('/:id', authenticateToken, asyncWrapper(deleteCompany));

// Rating routes
router.post('/:companyId/ratings', authenticateToken, asyncWrapper(createOrUpdateRating));
router.get('/:companyId/ratings', asyncWrapper(getCompanyRatings));
router.get('/:companyId/ratings/stats', asyncWrapper(getCompanyRatingStats));
router.get('/:companyId/ratings/me', authenticateToken, asyncWrapper(getUserRatingForCompany));
router.get('/ratings/me', authenticateToken, asyncWrapper(getUserRatings));
router.delete('/ratings/:ratingId', authenticateToken, asyncWrapper(deleteRating));

export default router;
