import {
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
}
