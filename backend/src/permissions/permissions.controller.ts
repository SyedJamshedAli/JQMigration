import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated permissions list' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('roleId') roleId?: string) {
    return this.permissionsService.findAll(Number(page) || 1, Number(limit) || 10, roleId);
  }

  @Get('select')
  @ApiOperation({ summary: 'Permissions for dropdown select' })
  selectList() {
    return this.permissionsService.selectList();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new permission' })
  create(@Body() dto: CreatePermissionDto, @Request() req: any) {
    return this.permissionsService.create(dto, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update permission' })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Delete('bulk/delete')
  @ApiOperation({ summary: 'Bulk delete permissions' })
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.permissionsService.bulkDelete(body.ids);
  }
}
