import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('Authentication')
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
}
