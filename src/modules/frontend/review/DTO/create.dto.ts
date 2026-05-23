import { ApiProperty } from '@nestjs/swagger';

export class CreateDtoReview {
    @ApiProperty()
    name: string;

    @ApiProperty()
    star: number;

    @ApiProperty()
    content: string;

    @ApiProperty()
    product_id: number;
}
