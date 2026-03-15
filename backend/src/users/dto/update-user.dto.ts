import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roleId?: string;
  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'] })
  @IsOptional() @IsEnum(['ACTIVE', 'INACTIVE', 'BLOCKED']) status?: string;
}
