import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2024-01-15',
    description: 'Appointment date (YYYY-MM-DD)',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: '10:30',
    description: 'Appointment time (HH:mm in 24h format)',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  time: string;

  @ApiProperty({ example: 'Dental cleaning' })
  @IsString()
  service: string;

  @ApiProperty({ example: 'I prefer morning appointments' })
  @IsOptional()
  @IsString()
  notes?: string;
}
