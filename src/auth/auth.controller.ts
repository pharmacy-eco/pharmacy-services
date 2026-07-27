import {
    Controller,
    Request,
    Post,
    UseGuards,
    Get,
    Headers,
    UnauthorizedException,
    Body,
    NotFoundException,
    HttpStatus,
    BadRequestException,
    Put,
    ConflictException,
    UsePipes,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { AuthService } from './auth.service';
import { ResponseService } from '../common/response/response.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestInfo } from '../common/request-info.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from '../modules/cms/users/users.service';
import { ProfileDto } from './dto/profile.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from './decorators/jwt.decorators';
import { IRequestInfo } from '../common/types';
import { LoginDto } from './dto/login.dto';
import { ResigerUserDto } from '../modules/cms/users/dto/register-user.dto';
import { CustomValidationPipe } from '../common/custom-validation-pipe';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private responseService: ResponseService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async handlelogin(@Request() req) {
        return this.authService.login(req.user);
    }

    @Public()
    @Post('user/login')
    @UsePipes(new CustomValidationPipe())
    async handleUserLogin(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password, 1);
        if (!user) {
            throw new UnauthorizedException('Tài khoản hoặc mật khẩu không trùng khớp!');
        }

        return this.authService.login(user);
    }

    @Public()
    @Post('user/register')
    @UsePipes(new CustomValidationPipe())
    async registerUser(@Body() resigerUserDto: ResigerUserDto, @RequestInfo() requestInfo: IRequestInfo) {
        await this.checkExistingFields(resigerUserDto.phone, resigerUserDto.email, resigerUserDto.phone);

        const createdUser = await this.userService.registerUser(resigerUserDto);
        if (createdUser) {
            return this.responseService.createResponse(
                HttpStatus.CREATED,
                'Đăng ký thành công',
                requestInfo.requestId,
                requestInfo.at,
                createdUser,
            );
        }

        return this.responseService.createResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Lỗi không xác định. Vui lòng thử lại sau',
            requestInfo.requestId,
            requestInfo.at,
        );
    }

    @Get('profile')
    async getProfile(@Request() req) {
        const _requestId = uuidv4();
        const at = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const user = await this.userService.findOne(req.user.userId);

        const profile = new ProfileDto({
            id: user.id,
            email: user.email,
            image: user.avatar,
            name: user.fullname,
        });

        return this.responseService.createResponse(200, 'Lấy thông tin người dùng thành công', _requestId, at, profile);
    }

    @Put('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @RequestInfo() requestInfo: IRequestInfo) {
        try {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Đổi mật khẩu thành công',
                requestInfo.requestId,
                requestInfo.at,
                await this.authService.changePassword(changePasswordDto),
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                return this.responseService.createResponse(
                    HttpStatus.NOT_FOUND,
                    error.message,
                    requestInfo.requestId,
                    requestInfo.at,
                );
            }
            if (error instanceof BadRequestException) {
                return this.responseService.createResponse(
                    HttpStatus.BAD_REQUEST,
                    error.message,
                    requestInfo.requestId,
                    requestInfo.at,
                );
            }

            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }

    @Put('update-profile')
    async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @RequestInfo() requestInfo: IRequestInfo) {
        try {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Cập nhật thành công',
                requestInfo.requestId,
                requestInfo.at,
                await this.authService.updateProfile(updateProfileDto),
            );
        } catch (error) {
            if (error instanceof NotFoundException) {
                return this.responseService.createResponse(
                    HttpStatus.NOT_FOUND,
                    error.message,
                    requestInfo.requestId,
                    requestInfo.at,
                );
            }

            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }

    @Get('decode')
    decodeToken(@Headers('authorization') authHeader: string) {
        if (!authHeader) {
            throw new UnauthorizedException('Token không được cung cấp');
        }

        const token = authHeader.split(' ')[1];
        return this.authService.decodeToken(token);
    }

    private async checkExistingFields(username: string, email: string, phone?: string) {
        const [existingUser, existingEmail, existingPhone] = await Promise.all([
            this.userService.findByField('username', username),
            this.userService.findByField('email', email),
            phone ? this.userService.findByField('phone', phone) : Promise.resolve(null),
        ]);

        const errors: Record<string, string> = {};
        if (existingUser) {
            errors['username'] = 'Tài khoản đã tồn tại';
        }
        if (existingEmail) {
            errors['email'] = 'Email đã tồn tại';
        }
        if (existingPhone) {
            errors['phone'] = 'Số điện thoại đã tồn tại';
        }

        if (Object.keys(errors).length > 0) {
            throw new ConflictException({
                message: [errors],
            });
        }
    }
}
