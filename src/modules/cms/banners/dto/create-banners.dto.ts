import { IStatusEnum } from '../../../../common/enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBannersDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    image: string;

    @ApiProperty({ example: 'ACTIVE = 1,INACTIVE = 0' })
    is_slider: number;

    @ApiProperty({ enum: IStatusEnum, example: 'ACTIVE = 1,INACTIVE = 2' })
    status: IStatusEnum;

    @ApiProperty()
    position: number;
}
