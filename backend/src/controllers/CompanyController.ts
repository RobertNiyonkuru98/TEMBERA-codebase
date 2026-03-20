import { CompanyService } from '@/services/CompanyService';
import { NotFoundError } from '@/utils/http-error';
import { ResponseHandler } from '@/utils/response';
import { Request, Response } from 'express';


const companyService = new CompanyService();

export const getAllCompanies = async (_req: Request, res: Response) => {
  const companies = await companyService.getAll();
  return ResponseHandler.success(res, 200, 'Companies retrieved successfully', companies);
};

export const getCompanyById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const company = await companyService.getById(id);
  if (!company) throw new NotFoundError('Company not found');
  return ResponseHandler.success(res, 200, 'Company retrieved successfully', company);
};

export const createCompany = async (req: Request, res: Response) => {
  const company = await companyService.create(req.body);
  return ResponseHandler.success(res, 201, 'Company created successfully', company);
};

export const updateCompany = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const company = await companyService.update(id, req.body);
  if (!company) throw new NotFoundError('Company not found');
  return ResponseHandler.success(res, 200, 'Company updated successfully', company);
};

export const deleteCompany = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await companyService.delete(id);
  if (!deleted) throw new NotFoundError('Company not found');
  return ResponseHandler.success(res, 200, 'Company deleted successfully', null);
};
