import { CompanyService } from '@/services/CompanyService';
import { Request, Response } from 'express';


const companyService = new CompanyService();

export const getAllCompanies = async (_req: Request, res: Response) => {
  const companies = await companyService.getAll();
  res.json(companies);
};

export const getCompanyById = async (req: Request, res: Response) => {
  const company = await companyService.getById(req.params.id as string);
  if (!company) return res.status(404).json({ message: 'Company not found' });
  return res.json(company);
};

export const createCompany = async (req: Request, res: Response) => {
  const company = await companyService.create(req.body);
  return res.status(201).json(company);
};

export const updateCompany = async (req: Request, res: Response) => {
  const company = await companyService.update(req.params.id as string, req.body);
  if (!company) return res.status(404).json({ message: 'Company not found' });
  return res.json(company);
};

export const deleteCompany = async (req: Request, res: Response) => {
  const deleted = await companyService.delete(req.params.id as string);
  if (!deleted) return res.status(404).json({ message: 'Company not found' });
  return res.status(204).send();
};
