import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'src/util/role.enum';
import { Exclude } from 'class-transformer';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phoneNumber: string;

  @Column()
  roles: UserRole;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
