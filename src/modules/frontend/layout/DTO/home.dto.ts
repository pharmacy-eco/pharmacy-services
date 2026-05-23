import { ApiProperty } from '@nestjs/swagger';

export class homeDto {
    @ApiProperty()
    pageSize: number;
}
