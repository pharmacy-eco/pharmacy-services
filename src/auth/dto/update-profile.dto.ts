import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    fullname: string;

    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    birthday: string;
}
