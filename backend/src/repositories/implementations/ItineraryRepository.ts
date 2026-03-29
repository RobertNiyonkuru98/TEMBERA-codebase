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
      include: {
        images: true,
        videos: true,
        ratings: {
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
        },
      },
    });
  }

  async findByCompanyId(companyId: string): Promise<Itinerary[]> {
    return await prisma.itinerary.findMany({
      where: { company_id: companyId },
      include: {
        images: true,
        videos: true,
        ratings: true,
      },
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
      include: {
        images: true,
        videos: true,
        ratings: true,
      },
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

  async createImages(itineraryId: string, imagePaths: string[]): Promise<void> {
    if (imagePaths.length === 0) {
      return;
    }

    await prisma.itineraryImage.createMany({
      data: imagePaths.map((imagePath, index) => ({
        itinerary_id: itineraryId,
        image_url: imagePath,
        public_id: `local_${Date.now()}_${index}`,
        order: index,
      })),
    });
  }

  async createCloudinaryImages(itineraryId: string, imageUrls: string[]): Promise<void> {
    if (imageUrls.length === 0) {
      return;
    }

    await prisma.itineraryImage.createMany({
      data: imageUrls.map((imageUrl, index) => {
        // Extract public_id from Cloudinary URL
        // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
        const publicIdMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        const publicId = publicIdMatch ? publicIdMatch[1] : `cloudinary_${Date.now()}_${index}`;
        
        return {
          itinerary_id: itineraryId,
          image_url: imageUrl,
          public_id: publicId,
          order: index,
        };
      }),
    });
  }

  async createVideos(itineraryId: string, videoData: Array<{ url: string; publicId: string; thumbnailUrl?: string }>): Promise<void> {
    if (videoData.length === 0) {
      return;
    }

    await prisma.itineraryVideo.createMany({
      data: videoData.map((video, index) => ({
        itinerary_id: itineraryId,
        video_url: video.url,
        public_id: video.publicId,
        thumbnail_url: video.thumbnailUrl,
        order: index,
      })),
    });
  }

  async deleteVideo(videoId: string): Promise<void> {
    await prisma.itineraryVideo.delete({ where: { id: videoId } });
  }

  async updateRatingStats(itineraryId: string): Promise<void> {
    const ratings = await prisma.itineraryRating.findMany({
      where: { itinerary_id: itineraryId },
      select: { rating: true },
    });

    if (ratings.length === 0) {
      await prisma.itinerary.update({
        where: { id: itineraryId },
        data: {
          average_rating: null,
          total_ratings: 0,
        },
      });
      return;
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    await prisma.itinerary.update({
      where: { id: itineraryId },
      data: {
        average_rating: averageRating,
        total_ratings: ratings.length,
      },
    });
  }
}
