import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

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

  async findAll() {
    return this.prisma.campaign.findMany({
      include: { schedules: true },
    });
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
