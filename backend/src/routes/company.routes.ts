import { Router } from 'express';
import * as CompanyController from '../controllers/CompanyController';

const router = Router();

router.get('/', CompanyController.getAllCompanies);
router.get('/:id', CompanyController.getCompanyById);
router.post('/', CompanyController.createCompany);
router.put('/:id', CompanyController.updateCompany);
router.delete('/:id', CompanyController.deleteCompany);

export default router;
