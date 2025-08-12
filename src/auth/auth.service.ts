import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/util/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: LoginUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("Email and password don't match");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithNoPassword } = user;
    return userWithNoPassword;
  }

  async login(data: LoginUserDto): Promise<{
    user: Partial<User>;
    access_token: string;
  }> {
    const user = await this.validateUser(data);

    const payload = {
      email: user?.email,
      role: user?.roles,
      id: user?.id,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: Partial<User> }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      roles: createUserDto.roles || UserRole.PATIENT,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword,
    };
  }
}
