import { Company, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { ICompanyRepository } from '../interfaces/ICompanyRepository';

export class CompanyRepository implements ICompanyRepository {
  // Create
  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return await prisma.company.create({ data });
  }

  // Read
  async findById(id: bigint): Promise<Company | null> {
    return await prisma.company.findUnique({
      where: { id },
    });
  }

  async findByOwnerId(ownerId: bigint): Promise<Company[]> {
    return await prisma.company.findMany({
      where: { owner_id: ownerId },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findAll(skip?: number, take?: number): Promise<Company[]> {
    return await prisma.company.findMany({
      skip,
      take,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findWithItineraries(id: bigint): Promise<Company | null> {
    return await prisma.company.findUnique({
      where: { id },
      include: {
        itineraries: true,
      },
    });
  }

  async findWithOwner(id: bigint): Promise<Company | null> {
    return await prisma.company.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });
  }

  // Update
  async update(id: bigint, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return await prisma.company.update({
      where: { id },
      data,
    });
  }

  async updateContact(id: bigint, contact: string): Promise<Company> {
    return await prisma.company.update({
      where: { id },
      data: { contact },
    });
  }

  // Count
  async count(): Promise<number> {
    return await prisma.company.count();
  }
}
