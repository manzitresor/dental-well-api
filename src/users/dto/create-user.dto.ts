import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from 'src/util/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Christelle Gihozo',
    required: true,
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'christelle@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+250788123456',
    required: true,
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'PATIENT',
    required: false,
    enum: UserRole,
  })
  @IsOptional()
  roles?: UserRole;

  @ApiProperty({
    example: 'dental@123',
    required: true,
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
