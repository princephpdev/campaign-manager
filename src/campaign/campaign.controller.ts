import { Body, Controller, Delete, Get, Param, Post, Put, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, FilterCampaignDto } from './dto/create-campaign.dto';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    try {
      return await this.campaignService.create(createCampaignDto);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findAll(@Query() filters: FilterCampaignDto, @Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    try {
      return await this.campaignService.findAll(filters, +page, +pageSize);
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.campaignService.findOne(+id);
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCampaignDto: CreateCampaignDto) {
    try {
      return await this.campaignService.update(+id, updateCampaignDto);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new HttpException(error.response.data.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.campaignService.remove(+id);
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
