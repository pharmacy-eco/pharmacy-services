// src/users/dto/change-password.dto.ts
import { IsString } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    image: string;
}
