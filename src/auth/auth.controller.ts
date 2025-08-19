import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: 3,
          fullName: 'Jackson Eric',
          email: 'jackson@gmail.com',
          roles: 'PATIENT',
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphY2tzb25AZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWQiOjMsImlhdCI6MTc0MTE4MTcyMSwiZXhwIjoxNzQxMTg1MzIxfQ.28Kz5VQUkLkD-P5LLPUUID0YahXYnHJS30HkwfQZXEA',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  login(@Body() loginRequest: LoginUserDto) {
    return this.authService.login(loginRequest);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    schema: {
      example: {
        user: {
          id: 1,
          fullName: 'John Doe',
          email: 'john@gmail.com',
          roles: 'PATIENT',
        },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
