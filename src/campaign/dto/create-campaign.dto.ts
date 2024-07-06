import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum CampaignType {
  CostPerOrder = 'Cost per Order',
  CostPerClick = 'Cost per Click',
  BuyOneGetOne = 'Buy One Get One',
}

class ScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dayOfWeek: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  endTime: string;
}

export class CreateCampaignDto {
  @ApiProperty({ enum: CampaignType })
  @IsEnum(CampaignType)
  type: CampaignType;

  @ApiProperty({ type: Date })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  endDate: Date;

  @ApiProperty({ type: ScheduleDto })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];
}

export class FilterCampaignDto {
  @ApiProperty({ enum: CampaignType, required: false })
  @IsOptional()
  @IsEnum(CampaignType)
  type?: CampaignType;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
