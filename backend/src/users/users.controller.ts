import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated users list' })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get('select')
  @ApiOperation({ summary: 'Get users for dropdown select' })
  selectList(@Query('search') search?: string) {
    return this.usersService.selectList(search);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  create(@Body() dto: CreateUserDto, @Request() req: any) {
    return this.usersService.create(dto, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req: any) {
    return this.usersService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete user' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.usersService.remove(id, req.user.id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore deleted user' })
  restore(@Param('id') id: string, @Request() req: any) {
    return this.usersService.restore(id, req.user.id);
  }
}
