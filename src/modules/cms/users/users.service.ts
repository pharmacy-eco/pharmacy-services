import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterUserDto } from './dto/filter-user.dto';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { CreateNewsUserDto } from './dto/create-new-user.dto';
import { ResigerUserDto } from './dto/register-user.dto';
import { UpdateOneUserDto } from './dto/update-one-user.dto';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { UserListDto } from './dto/list-user.dto';
import { Users } from '../../../entity/users.entity';

@Injectable()
export class UsersService {
    private saltOrRounds: number = 10;
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: FilterUserDto) {
        try {
            const { name, status, pageIndex = 1, pageSize = 20, sort } = payload;

            const queryBuilder = this.userRepository
                .createQueryBuilder('users')
                .leftJoin('roles', 'r', 'r.id = users.role_id')
                .select([
                    'users.id as id',
                    'users.fullname as fullname',
                    'users.username as username',
                    'users.email as email',
                    'users.status as status',
                    'users.avatar as avatar',
                    'users.role_id as role_id',
                    'r.name as role_name',
                    'users.created_at as created_at',
                    'users.updated_at as updated_at',
                ]);

            if (sort) {
                queryBuilder.orderBy(`users.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`users.id`, 'DESC');
            }

            if (name) queryBuilder.andWhere('users.name LIKE :name', { name: `%${name}%` });

            if (status) queryBuilder.andWhere('users.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getRawMany(),
                queryBuilder.getCount(),
            ]);

            const users = entities.map((user) => new UserListDto(user));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, users);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách người dùng.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            return await this.userRepository.findOne({
                where: { id },
                select: ['id', 'username', 'email', 'phone', 'avatar', 'username', 'password', 'status', 'role_id'],
            });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết người dùng.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.userRepository.createQueryBuilder('users');
            queryBuilder.where(`users.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();
            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết người dùng.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewUserDto: CreateNewsUserDto) {
        try {
            const currentUser = this.request.user;

            const hashedPassword = await bcrypt.hash(createNewUserDto.password, this.saltOrRounds);

            const updatedUser = plainToClass(Users, {
                ...createNewUserDto,
                created_by: currentUser?.id,
                updated_by: currentUser?.id,
                password: hashedPassword,
            });

            await this.userRepository.save(updatedUser);

            return true;
        } catch (error) {
            logger.error('Lỗi khi tạo mới người dùng.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, userDto: UpdateOneUserDto) {
        try {
            // Kiểm tra xem người dùng có tồn tại không
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                logger.error(`Không tìm thấy người dùng với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
            }

            // Cập nhật thông tin người dùng
            const updatedUser = plainToClass(Users, { ...user, ...userDto });
            const savedUser = await this.userRepository.save(updatedUser);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = savedUser;
            return userWithoutPassword;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID người dùng "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật người dùng.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa người dùng.');
            logger.error(error.stack);
            return null;
        }
    }

    async registerUser(resigerUserDto: ResigerUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(resigerUserDto.password, this.saltOrRounds);
            const newUserWithHashedPassword = {
                ...resigerUserDto,
                password: hashedPassword,
            };
            const savedUser = await this.userRepository.save(newUserWithHashedPassword);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = savedUser;

            return userWithoutPassword;
        } catch (error) {
            console.log(error, 'error');
            logger.error('Đăng ký tài khoản thành công.');
            logger.error(error.stack);
            return null;
        }
    }

    async resetPassUser(id: number) {
        try {
            // Kiểm tra xem người dùng có tồn tại không
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                logger.error(`Không tìm thấy người dùng với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
            }
            const newPassword = process.env.PASSWORD_DEFAULT;
            const hashedPassword = await bcrypt.hash(newPassword, this.saltOrRounds);
            user.password = hashedPassword;
            const savedUser = await this.userRepository.save(user);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = savedUser;
            return userWithoutPassword;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID người dùng "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi reset mật khẩu người dùng.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async updateStatusUser(id: number) {
        try {
            // Kiểm tra xem người dùng có tồn tại không
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                logger.error(`Không tìm thấy người dùng với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
            }
            const newStatus = user.status == 1 ? 0 : 1; // Nếu trạng thái đang là 1 thì sẽ cập nhật sang 0 Và ngược lại
            user.status = newStatus;
            const savedUser = await this.userRepository.save(user);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = savedUser;
            return userWithoutPassword;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID người dùng "${id}" không hợp lệ.`);
            } else {
                logger.error('Cập nhật trạng thái người dùng thành công.');
                logger.error(error.stack);
            }
            return null;
        }
    }
}
