import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResigerUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @ApiProperty()
    phone: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @ApiProperty()
    password: string;
}
