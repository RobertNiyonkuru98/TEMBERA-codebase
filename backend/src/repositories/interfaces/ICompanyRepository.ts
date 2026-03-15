import { Company, Prisma } from '@prisma/client';

export interface ICompanyRepository {
  // Create
  create(data: Prisma.CompanyCreateInput): Promise<Company>;

  // Read
  findById(id: bigint): Promise<Company | null>;
  findByOwnerId(ownerId: bigint): Promise<Company[]>;
  findAll(skip?: number, take?: number): Promise<Company[]>;
  findWithItineraries(id: bigint): Promise<Company | null>;
  findWithOwner(id: bigint): Promise<Company | null>;

  // Update
  update(id: bigint, data: Prisma.CompanyUpdateInput): Promise<Company>;
  updateContact(id: bigint, contact: string): Promise<Company>;

  // Count
  count(): Promise<number>;
}
