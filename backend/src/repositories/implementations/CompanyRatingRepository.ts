import { CompanyRating, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { ICompanyRatingRepository } from '../interfaces/ICompanyRatingRepository';

export class CompanyRatingRepository implements ICompanyRatingRepository {
  async create(data: Prisma.CompanyRatingCreateInput): Promise<CompanyRating> {
    return await prisma.companyRating.create({ data });
  }

  async findById(id: string): Promise<CompanyRating | null> {
    return await prisma.companyRating.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserAndCompany(userId: string, companyId: string): Promise<CompanyRating | null> {
    return await prisma.companyRating.findUnique({
      where: {
        user_id_company_id: {
          user_id: userId,
          company_id: companyId,
        },
      },
    });
  }

  async findByCompanyId(companyId: string): Promise<CompanyRating[]> {
    return await prisma.companyRating.findMany({
      where: { company_id: companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByUserId(userId: string): Promise<CompanyRating[]> {
    return await prisma.companyRating.findMany({
      where: { user_id: userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id: string, data: Prisma.CompanyRatingUpdateInput): Promise<CompanyRating> {
    return await prisma.companyRating.update({
      where: { id },
      data,
    });
  }

  async upsert(userId: string, companyId: string, data: { rating: number; comment?: string }): Promise<CompanyRating> {
    return await prisma.companyRating.upsert({
      where: {
        user_id_company_id: {
          user_id: userId,
          company_id: companyId,
        },
      },
      update: {
        rating: data.rating,
        comment: data.comment,
      },
      create: {
        rating: data.rating,
        comment: data.comment,
        user: {
          connect: { id: userId },
        },
        company: {
          connect: { id: companyId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.companyRating.delete({
      where: { id },
    });
  }

  async getAverageRating(companyId: string): Promise<number | null> {
    const result = await prisma.companyRating.aggregate({
      where: { company_id: companyId },
      _avg: {
        rating: true,
      },
    });
    return result._avg.rating;
  }

  async getRatingStats(companyId: string): Promise<{ average: number; count: number }> {
    const result = await prisma.companyRating.aggregate({
      where: { company_id: companyId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating || 0,
    };
  }
}
