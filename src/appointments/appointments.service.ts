import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentStatus } from 'src/util/appointment.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}
  async create(
    userId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        date: createAppointmentDto.date,
        time: createAppointmentDto.time,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    if (existingAppointment) {
      throw new ConflictException('This time slot is already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      user: { id: userId },
      status: AppointmentStatus.PENDING,
    });
    return await this.appointmentRepository.save(appointment);
  }

  async findAll(userId?: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: userId ? { user: { id: userId } } : {},
      relations: ['user'],
      order: {
        date: 'ASC',
        time: 'ASC',
      },
    });
  }
}
