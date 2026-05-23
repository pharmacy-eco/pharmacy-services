import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateOneUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @ApiProperty()
    fullname: string;

    @IsNotEmpty({ message: 'Tên không được để trống' })
    @ApiProperty()
    gender: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    avatar: string;

    @IsNotEmpty({ message: 'Tài khoản không được để trống' })
    @ApiProperty()
    username: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @ApiProperty()
    password: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    role_id: number;
}
