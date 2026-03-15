import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated roles list' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.rolesService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get('select')
  @ApiOperation({ summary: 'Get roles for dropdown select' })
  selectList() {
    return this.rolesService.selectList();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new role' })
  create(@Body() dto: CreateRoleDto, @Request() req: any) {
    return this.rolesService.create(dto, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role' })
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set role as default' })
  setDefault(@Param('id') id: string) {
    return this.rolesService.setDefault(id);
  }
}
