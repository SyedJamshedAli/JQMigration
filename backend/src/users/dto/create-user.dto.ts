import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty({ minLength: 6 }) @IsString() @MinLength(6) password: string;
  @ApiProperty() @IsString() roleId: string;
  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'] })
  @IsOptional() @IsEnum(['ACTIVE', 'INACTIVE', 'BLOCKED']) status?: string;
}
