import { Orders } from '../../../../entity/orders.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

class OrderDetailListDto {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    total_price: number;
    image: string;

    constructor(detail) {
        this.id = detail.id;
        this.product_id = Number(detail.product_id);
        this.product_name = detail.products?.name || '';
        this.quantity = detail.quantity;
        this.price = detail.price;
        this.total_price = Number(detail.quantity || 0) * Number(detail.price || 0);
        this.image = detail.products?.productImage?.find((image) => Number(image.is_thumbnail) === 1)?.url || null;
    }
}

export class OrdersListDto {
    id: number;
    name: string;
    email: string;
    code: string;
    phone: string;
    address: string;
    status: number;
    payment_method: string;
    payment_status: string;
    total_price: number;
    created_at: string;
    updated_at: string;
    orderDetail: OrderDetailListDto[];

    constructor(order: Orders) {
        const orderDetail = order.orderDetail || [];

        this.id = order.id;
        this.name = order.name;
        this.email = order.email;
        this.code = order.code;
        this.phone = order.phone;
        this.address = order.address;
        this.status = order.status;
        this.payment_method = order.payment_method;
        this.payment_status = order.payment_status;
        this.orderDetail = orderDetail.map((detail) => new OrderDetailListDto(detail));
        this.total_price = this.orderDetail.reduce((total, detail) => total + detail.total_price, 0);
        this.created_at = order.created_at ? formatDateTime(order.created_at) : '';
        this.updated_at = order.updated_at ? formatDateTime(order.updated_at) : '';
    }
}
