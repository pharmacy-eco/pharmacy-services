import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'Tài khoản không được để trống' })
    @ApiProperty()
    username: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @ApiProperty()
    password: string;
}
