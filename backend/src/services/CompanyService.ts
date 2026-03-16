import { CompanyRepository } from '../repositories/implementations/CompanyRepository';
import { Prisma, Company } from '@prisma/client';

export class CompanyService {
  private companyRepository = new CompanyRepository();

  async getAll(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }

  async getById(id: string): Promise<Company | null> {
    return this.companyRepository.findById(id);
  }

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.companyRepository.create(data);
  }

  async update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company | null> {
    try {
      return await this.companyRepository.update(id, data);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.companyRepository.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
