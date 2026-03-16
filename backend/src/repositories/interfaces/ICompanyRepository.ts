import { Company, Prisma } from '@prisma/client';

export interface ICompanyRepository {
  // Create
  create(data: Prisma.CompanyCreateInput): Promise<Company>;

  // Read
  findById(id: string): Promise<Company | null>;
  findByOwnerId(ownerId: string): Promise<Company[]>;
  findAll(skip?: number, take?: number): Promise<Company[]>;
  findWithItineraries(id: string): Promise<Company | null>;
  findWithOwner(id: string): Promise<Company | null>;

  // Update
  update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company>;
  updateContact(id: string, contact: string): Promise<Company>;

  // Delete
  delete(id: string): Promise<void>;

  // Count
  count(): Promise<number>;
}
