import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/cms/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from '../common/response/response.service';
import { v4 as uuidv4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { REQUEST } from '@nestjs/core';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../entity/roles.entity';
import { RoleHasPermissions } from '../entity/role_has_permission.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private responseService: ResponseService,
        @Inject(REQUEST) private readonly request: CustomRequest,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Roles)
        private roleRepository: Repository<Roles>,
        @InjectRepository(RoleHasPermissions)
        private rolehasRepository: Repository<RoleHasPermissions>,
    ) {}
    async validateUser(username: string, password: string): Promise<Users | null> {
        const user = await this.usersService.findByField('username', username);

        if (!user) {
            return null;
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (user && passwordValid && user.status === 1) {
            return {
                ...user,
            };
        }

        return null;
    }
    async login(user: Users) {
        const _requestId = uuidv4();
        // const code = user.code ? user.code : `KH_${user.id}`;
        const at = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const payload = { username: user.username, sub: user.id };
        const access_token = this.jwtService.sign(payload, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            secret: process.env.JWT_SECRET,
        });
        // const codeList = await this.roleService.findCodeList(user.role_id);

        return this.responseService.createResponse(200, 'Đăng nhập thành công', _requestId, at, {
            access_token,
            expires_in: process.env.JWT_EXPIRES_IN,
            dataUser: user,
            // lstRoleCode: codeList,
        });
    }

    async Profile(id: number) {
        const profile = this.userRepository.findOne({ where: { id } });
        return profile;
    }

    decodeToken(token: string): string {
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            return decoded;
        } catch (error) {
            throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const currentUser = this.request.user;

        const user = await this.usersService.findOne(currentUser?.id);
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Mật khẩu cũ không chính sác');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await this.userRepository.save(user);
    }

    async updateProfile(updateProfileDto: UpdateProfileDto) {
        const { email, image } = updateProfileDto;

        const currentUser = this.request.user;

        const user = await this.usersService.findOne(currentUser?.id);
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }
        // user. = name;
        user.email = email;
        user.avatar = image;

        await this.userRepository.save(user);
    }
}
