import { Itinerary, Prisma } from '@prisma/client';
import prisma from '../../db/prisma.client';
import { IItineraryRepository } from '../interfaces/IItineraryRepository';

export class ItineraryRepository implements IItineraryRepository {
  // Create
  async create(data: Prisma.ItineraryCreateInput): Promise<Itinerary> {
    return await prisma.itinerary.create({ data });
  }

  // Read
  async findById(id: string): Promise<Itinerary | null> {
    return await prisma.itinerary.findUnique({
      where: { id },
    });
  }

  async findByCompanyId(companyId: string): Promise<Itinerary[]> {
    return await prisma.itinerary.findMany({
      where: { company_id: companyId },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findByLocation(location: string): Promise<Itinerary[]> {
    return await prisma.itinerary.findMany({
      where: {
        location: {
          contains: location,
          mode: 'insensitive',
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Itinerary[]> {
    return await prisma.itinerary.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Itinerary[]> {
    return await prisma.itinerary.findMany({
      where: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async findAll(skip?: number, take?: number): Promise<Itinerary[]> {
    return await prisma.itinerary.findMany({
      skip,
      take,
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findWithCompany(id: string): Promise<Itinerary | null> {
    return await prisma.itinerary.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });
  }

  // Update
  async update(id: string, data: Prisma.ItineraryUpdateInput): Promise<Itinerary> {
    return await prisma.itinerary.update({
      where: { id },
      data,
    });
  }

  async updatePrice(id: string, price: number): Promise<Itinerary> {
    return await prisma.itinerary.update({
      where: { id },
      data: { price },
    });
  }

  async updateDate(id: string, date: Date): Promise<Itinerary> {
    return await prisma.itinerary.update({
      where: { id },
      data: { date },
    });
  }

  // Delete
  async delete(id: string): Promise<void> {
    await prisma.itinerary.delete({ where: { id } });
  }

  // Count
  async count(): Promise<number> {
    return await prisma.itinerary.count();
  }
}
