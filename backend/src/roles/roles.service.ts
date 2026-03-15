import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
import { UserRolePermission } from '../entities/user-role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(UserRole) private roleRepo: Repository<UserRole>,
    @InjectRepository(UserRolePermission) private rpRepo: Repository<UserRolePermission>,
    private dataSource: DataSource,
  ) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const qb = this.roleRepo.createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'rp')
      .leftJoinAndSelect('rp.permission', 'permission')
      .loadRelationCountAndMap('role.usersCount', 'role.users')
      .where('role.isTrashed = :isTrashed', { isTrashed: false })
      .orderBy('role.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions', 'permissions.permission'],
    });
    if (!role) throw new NotFoundException('Role not found.');
    return role;
  }

  async create(dto: CreateRoleDto, userId: string) {
    const existing = await this.roleRepo.createQueryBuilder('role')
      .where('role.name = :name OR role.slug = :slug', { name: dto.name, slug: dto.slug })
      .getOne();
    if (existing) throw new ConflictException('Role name or slug already exists.');

    return this.dataSource.transaction(async (manager) => {
      const role = manager.create(UserRole, {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        createdByUserId: userId,
      });
      const savedRole = await manager.save(role);

      if (dto.permissionIds?.length) {
        const rpEntities = dto.permissionIds.map((permId) =>
          manager.create(UserRolePermission, { roleId: savedRole.id, permissionId: permId }),
        );
        await manager.save(rpEntities);
      }

      return manager.findOne(UserRole, {
        where: { id: savedRole.id },
        relations: ['permissions', 'permissions.permission'],
      });
    });
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found.');

    return this.dataSource.transaction(async (manager) => {
      await manager.update(UserRole, id, {
        name: dto.name,
        description: dto.description,
      });

      if (dto.permissionIds !== undefined) {
        await manager.delete(UserRolePermission, { roleId: id });
        if (dto.permissionIds.length) {
          const rpEntities = dto.permissionIds.map((permId) =>
            manager.create(UserRolePermission, { roleId: id, permissionId: permId }),
          );
          await manager.save(rpEntities);
        }
      }

      return manager.findOne(UserRole, {
        where: { id },
        relations: ['permissions', 'permissions.permission'],
      });
    });
  }

  async remove(id: string) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!role) throw new NotFoundException('Role not found.');
    if (role.isProtected) throw new ForbiddenException('Cannot delete protected role.');
    if (role.users?.length > 0) throw new ConflictException('Cannot delete role with assigned users.');

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(UserRolePermission, { roleId: id });
      await manager.delete(UserRole, id);
    });

    return { message: 'Role deleted successfully.' };
  }

  async setDefault(id: string) {
    await this.dataSource.transaction(async (manager) => {
      await manager.update(UserRole, {}, { isDefault: false });
      await manager.update(UserRole, id, { isDefault: true });
    });
    return { message: 'Default role updated.' };
  }

  async selectList() {
    return this.roleRepo.find({
      where: { isTrashed: false },
      select: ['id', 'name', 'slug'],
    });
  }
}
