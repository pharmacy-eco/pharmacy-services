import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodEnum } from '../../../../common/enum';

export class CreateDtoOrder {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty({ required: false, enum: PaymentMethodEnum, default: PaymentMethodEnum.CASH })
    payment_method?: PaymentMethodEnum;

    @ApiProperty({ required: false })
    bankCode?: string;

    @ApiProperty()
    cart: ICartPayload[];
}

interface ICartPayload {
    product_id: number;
    quantity: number;
    price: number;
}
