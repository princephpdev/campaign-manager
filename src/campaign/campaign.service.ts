import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCampaignDto, FilterCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCampaignDto) {
    try {
      return await this.prisma.campaign.create({
        data: {
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          schedules: {
            create: data.schedules.map((schedule) => ({
              ...schedule,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
            })),
          },
        },
        include: { schedules: true },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(filters: FilterCampaignDto, page: number, pageSize: number) {
    const where = {};
    if (filters.type) where['type'] = filters.type;
    if (filters.startDate) where['startDate'] = { gte: filters.startDate };
    if (filters.endDate) where['endDate'] = { lte: filters.endDate };

    try {
      const [total, campaigns] = await this.prisma.$transaction([
        this.prisma.campaign.count({ where }),
        this.prisma.campaign.findMany({
          where,
          include: { schedules: true },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      return { total, campaigns };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.campaign.findUnique({
        where: { id },
        include: { schedules: true },
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data: CreateCampaignDto) {
    try {
      await this.prisma.schedule.deleteMany({ where: { campaignId: id } });
      return await this.prisma.campaign.update({
        where: { id },
        data: {
          ...data,
          schedules: {
            create: data.schedules,
          },
        },
        include: { schedules: true },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.campaign.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
