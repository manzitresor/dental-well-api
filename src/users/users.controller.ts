import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Returns all registered User' })
  @ApiResponse({ status: 200, description: 'Returns an array of users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a specific User' })
  @ApiResponse({ status: 200, description: 'Returns a single user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
