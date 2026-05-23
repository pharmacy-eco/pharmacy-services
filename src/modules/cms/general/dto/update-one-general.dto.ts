import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class SocialDTO {
    @ApiProperty()
    image: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    link: boolean;
}

export class UpdateGeneralDto {
    @ApiProperty()
    company: string;

    @ApiProperty()
    link_map: string;

    @ApiProperty()
    iframe_map: string;

    @ApiProperty()
    info: string;

    @ApiProperty()
    hotline: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    logo: string;

    @ApiProperty()
    favicon: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => SocialDTO)
    social: SocialDTO[];

    @ApiProperty()
    add_body: string;

    @ApiProperty()
    meta_title: string;

    @ApiProperty()
    meta_keyword: string;

    @ApiProperty()
    meta_description: string;
}
