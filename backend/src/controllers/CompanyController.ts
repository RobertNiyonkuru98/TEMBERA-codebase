import { CompanyService } from '@/services/CompanyService';
import { Request, Response } from 'express';


const companyService = new CompanyService();

export const getAllCompanies = async (_req: Request, res: Response) => {
  const companies = await companyService.getAll();
  return res.json(companies);
};

export const getCompanyById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const company = await companyService.getById(id);
  if (!company) return res.status(404).json({ message: 'Company not found' });
  return res.json(company);
};

export const createCompany = async (req: Request, res: Response) => {
  const company = await companyService.create(req.body);
  return res.status(201).json(company);
};

export const updateCompany = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const company = await companyService.update(id, req.body);
  if (!company) return res.status(404).json({ message: 'Company not found' });
  return res.json(company);
};

export const deleteCompany = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await companyService.delete(id);
  if (!deleted) return res.status(404).json({ message: 'Company not found' });
  return res.status(204).send();
};
