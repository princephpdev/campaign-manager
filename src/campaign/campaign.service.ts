import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCampaignDto, FilterCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        ...data,
        schedules: {
          create: data.schedules,
        },
      },
      include: { schedules: true },
    });
  }

  async findAll(filters: FilterCampaignDto, page: number, pageSize: number) {
    const where = {};
    if (filters.type) where['type'] = filters.type;
    if (filters.startDate) where['startDate'] = { gte: filters.startDate };
    if (filters.endDate) where['endDate'] = { lte: filters.endDate };

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
  }

  async findOne(id: number) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: { schedules: true },
    });
  }

  async update(id: number, data: CreateCampaignDto) {
    await this.prisma.schedule.deleteMany({ where: { campaignId: id } });
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...data,
        schedules: {
          create: data.schedules,
        },
      },
      include: { schedules: true },
    });
  }

  async remove(id: number) {
    return this.prisma.campaign.delete({
      where: { id },
    });
  }
}
