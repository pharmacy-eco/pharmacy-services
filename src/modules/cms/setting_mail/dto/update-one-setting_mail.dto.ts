import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class ContentMailDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    content: string;
}

export class UpdateSettingMailDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    host: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    port: string;

    @ApiProperty({ example: [true, false], description: 'true: SSL false:TCL' })
    @IsNotEmpty({ message: 'Không được để trống' })
    secure: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    user: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    pass: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    address: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => ContentMailDto)
    RESETPASS: ContentMailDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => ContentMailDto)
    CONFIRM: ContentMailDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => ContentMailDto)
    PAYMENT: ContentMailDto;
}
