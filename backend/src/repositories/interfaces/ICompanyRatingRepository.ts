import { CompanyRating, Prisma } from '@prisma/client';

export interface ICompanyRatingRepository {
  create(data: Prisma.CompanyRatingCreateInput): Promise<CompanyRating>;
  findById(id: string): Promise<CompanyRating | null>;
  findByUserAndCompany(userId: string, companyId: string): Promise<CompanyRating | null>;
  findByCompanyId(companyId: string): Promise<CompanyRating[]>;
  findByUserId(userId: string): Promise<CompanyRating[]>;
  update(id: string, data: Prisma.CompanyRatingUpdateInput): Promise<CompanyRating>;
  upsert(userId: string, companyId: string, data: { rating: number; comment?: string }): Promise<CompanyRating>;
  delete(id: string): Promise<void>;
  getAverageRating(companyId: string): Promise<number | null>;
  getRatingStats(companyId: string): Promise<{ average: number; count: number }>;
}
