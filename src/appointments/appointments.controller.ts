import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RequestWithUser } from 'src/auth/types/request-with-user';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Appointment } from './entities/appointment.entity';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        apppoint: {
          date: '2024-01-15',
          time: '10:30',
          service: 'Dental cleaning',
          notes: 'I prefer morning appointments',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.appointmentsService.create(req.user.id, createAppointmentDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of appointments retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Apppointment Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 403,
    description: 'Dear User, you cannot access this resource',
  })
  findAll(@Req() req: RequestWithUser) {
    return this.appointmentsService.findAll(req.user.id);
  }
}
