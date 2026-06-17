import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/cms/users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from '../modules/cms/users/users.service';
import { LocalStrategy } from './passport/local.auth';
import { ResponseService } from '../common/response/response.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './passport/jwt.strategy';
import { Users } from '../entity/users.entity';
import { Roles } from '../entity/roles.entity';
import { RoleHasPermissions } from '../entity/role_has_permission.entity';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        TypeOrmModule.forFeature([Users, Roles, RoleHasPermissions]),
    ],
    providers: [AuthService, UsersService, LocalStrategy, ResponseService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
