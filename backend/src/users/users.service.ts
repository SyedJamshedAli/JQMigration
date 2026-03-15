import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SystemLogService } from '../system-log/system-log.service';
import { StorageService } from '../storage/storage.service';
import { User, UserStatus } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private roleRepo: Repository<UserRole>,
    private dataSource: DataSource,
    private systemLog: SystemLogService,
    private storage: StorageService,
  ) {}

  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10, search, status, roleId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const qb = this.userRepo.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isTrashed = :isTrashed', { isTrashed: false });

    if (status) qb.andWhere('user.status = :status', { status });
    if (roleId) qb.andWhere('user.roleId = :roleId', { roleId });
    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy(`user.${sortBy}`, sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async create(dto: CreateUserDto, currentUserId: string) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use.');

    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role not found.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.dataSource.transaction(async (manager) => {
      const newUser = manager.create(User, {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        roleId: dto.roleId,
        status: (dto.status as UserStatus) || UserStatus.ACTIVE,
        invitedByUserId: currentUserId,
      });

      const savedUser = await manager.save(newUser);

      await this.systemLog.log({
        event: 'USER_CREATED',
        userId: currentUserId,
        entityId: savedUser.id,
        entityType: 'User',
        description: `Created user ${savedUser.email}`,
      }, manager);

      return manager.findOne(User, { where: { id: savedUser.id }, relations: ['role'] });
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');

    const updated = await this.dataSource.transaction(async (manager) => {
      await manager.update(User, id, {
        name: dto.name,
        status: dto.status as UserStatus,
        roleId: dto.roleId,
      });

      await this.systemLog.log({
        event: 'USER_UPDATED',
        userId: currentUserId,
        entityId: id,
        entityType: 'User',
        description: `Updated user ${user.email}`,
      }, manager);

      return manager.findOne(User, { where: { id }, relations: ['role'] });
    });

    return updated;
  }

  async remove(id: string, currentUserId: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');
    if (user.isProtected) throw new ForbiddenException('Cannot delete protected user.');

    await this.dataSource.transaction(async (manager) => {
      await manager.update(User, id, { isTrashed: true, status: UserStatus.INACTIVE });

      await this.systemLog.log({
        event: 'USER_DELETED',
        userId: currentUserId,
        entityId: id,
        entityType: 'User',
        description: `Soft-deleted user ${user.email}`,
      }, manager);
    });

    return { message: 'User deleted successfully.' };
  }

  async restore(id: string, currentUserId: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');

    await this.userRepo.update(id, { isTrashed: false, status: UserStatus.ACTIVE });

    return { message: 'User restored successfully.' };
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: any }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    const updateData: Partial<User> = {};
    if (data.name) updateData.name = data.name;

    if (data.avatar) {
      if (user.avatar) await this.storage.deleteFile(user.avatar);
      updateData.avatar = await this.storage.uploadFile(data.avatar, 'avatars');
    }

    await this.userRepo.update(userId, updateData);
    return this.userRepo.findOne({ where: { id: userId }, relations: ['role'] });
  }

  async selectList(search?: string) {
    const qb = this.userRepo.createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.avatar'])
      .where('user.isTrashed = :isTrashed', { isTrashed: false })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
    }

    return qb.take(20).getMany();
  }
}
