import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidSchedule } from 'src/common/decorators/is-valid-schedule.decorator';
import { InvalidScheduleDateTimeMessageError } from 'src/common/constants/custom-error-messages';

enum CampaignType {
  CostPerOrder = 'Cost per Order',
  CostPerClick = 'Cost per Click',
  BuyOneGetOne = 'Buy One Get One',
}

enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

class ScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in the format HH:mm',
  })
  startTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in the format HH:mm',
  })
  endTime: string;
}

export class CreateCampaignDto {
  @ApiProperty({ enum: CampaignType })
  @IsEnum(CampaignType)
  type: CampaignType;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ type: ScheduleDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  @IsValidSchedule({
    message: InvalidScheduleDateTimeMessageError,
  })
  schedules: ScheduleDto[];
}

export class FilterCampaignDto {
  @ApiProperty({ enum: CampaignType, required: false })
  @IsOptional()
  @IsEnum(CampaignType)
  type?: CampaignType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
