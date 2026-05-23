import { ApiProperty } from '@nestjs/swagger';

export class CreateDtoOrder {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    cart: ICartPayload[];
}

interface ICartPayload {
    product_id: number;
    quantity: number;
    price: number;
}
