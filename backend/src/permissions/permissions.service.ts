import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { UserRolePermission } from '../entities/user-role-permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserPermission) private permRepo: Repository<UserPermission>,
    @InjectRepository(UserRolePermission) private rpRepo: Repository<UserRolePermission>,
    private dataSource: DataSource,
  ) {}

  async findAll(page = 1, limit = 10, roleId?: string) {
    const skip = (page - 1) * limit;

    const qb = this.permRepo.createQueryBuilder('perm')
      .leftJoinAndSelect('perm.roles', 'rp')
      .leftJoinAndSelect('rp.role', 'role');

    if (roleId) {
      qb.where('rp.roleId = :roleId', { roleId });
    }

    qb.orderBy('perm.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const permission = await this.permRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
    });
    if (!permission) throw new NotFoundException('Permission not found.');
    return permission;
  }

  async create(dto: CreatePermissionDto, userId: string) {
    const existing = await this.permRepo.createQueryBuilder('perm')
      .where('perm.name = :name OR perm.slug = :slug', { name: dto.name, slug: dto.slug })
      .getOne();
    if (existing) throw new ConflictException('Permission name or slug already exists.');

    const permission = this.permRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      createdByUserId: userId,
    });

    return this.permRepo.save(permission);
  }

  async update(id: string, dto: UpdatePermissionDto) {
    const permission = await this.permRepo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permission not found.');

    await this.permRepo.update(id, {
      name: dto.name,
      description: dto.description,
    });

    return this.permRepo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const permission = await this.permRepo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Permission not found.');

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(UserRolePermission, { permissionId: id });
      await manager.delete(UserPermission, id);
    });

    return { message: 'Permission deleted successfully.' };
  }

  async bulkDelete(ids: string[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(UserRolePermission, { permissionId: In(ids) });
      await manager.delete(UserPermission, { id: In(ids) });
    });
    return { message: `${ids.length} permissions deleted.` };
  }

  async selectList() {
    return this.permRepo.find({
      select: ['id', 'name', 'slug'],
    });
  }
}
