import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() roleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string;
  @ApiPropertyOptional({ enum: ['asc', 'desc'] }) @IsOptional() @IsEnum(['asc', 'desc']) sortOrder?: string;
}
