import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { Orders } from '../../../entity/orders.entity';
import { CreateDtoOrder } from './DTO/create.dto';
import { OrderDetail } from '../../../entity/order_detail.entity';
import { Products } from '../../../entity/products.entity';
import { v4 as uuidv4 } from 'uuid';
import { PaymentMethodEnum, PaymentStatusEnum } from '../../../common/enum';
import { TransactionService } from '../../cms/transaction/transaction.service';
import { VnpayService } from '../../vnpay/vnpay.service';

@Injectable({ scope: Scope.REQUEST })
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private orderRepository: Repository<Orders>,
        private readonly transactionService: TransactionService,
        private readonly vnpayService: VnpayService,
    ) {}

    async create(payload: CreateDtoOrder) {
        const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const paymentMethod =
                String(payload.payment_method || PaymentMethodEnum.CASH).toUpperCase() === PaymentMethodEnum.VNPAY
                    ? PaymentMethodEnum.VNPAY
                    : PaymentMethodEnum.CASH;
            const totalPrice = (payload.cart || []).reduce((total, item) => {
                return total + Number(item.quantity || 0) * Number(item.price || 0);
            }, 0);

            const order = this.orderRepository.create({
                address: payload.address,
                email: payload.email,
                name: payload.name,
                phone: payload.phone,
                code: uuidv4(),
                status: 1,
                payment_method: paymentMethod,
                payment_status: PaymentStatusEnum.PENDING,
            });

            const orderSaved = await queryRunner.manager.save(order);

            const detailArray: OrderDetail[] = await Promise.all(
                payload.cart.map(async (val) => {
                    const product = await queryRunner.manager.findOne(Products, {
                        where: { id: val.product_id },
                    });

                    const detail = new OrderDetail();
                    detail.orders = orderSaved;
                    detail.price = val.price;
                    detail.quantity = val.quantity;
                    detail.products = product;

                    return detail;
                }),
            );

            await queryRunner.manager.save(OrderDetail, detailArray);

            if (paymentMethod === PaymentMethodEnum.CASH) {
                await this.transactionService.createCashPayment(orderSaved, totalPrice, queryRunner.manager);
            }

            await queryRunner.commitTransaction();

            if (paymentMethod === PaymentMethodEnum.VNPAY) {
                const paymentData = await this.vnpayService.createPaymentUrl({
                    orderCode: orderSaved.code,
                    bankCode: payload.bankCode,
                });

                if (!paymentData || paymentData.isError) {
                    return null;
                }

                return {
                    order_code: orderSaved.code,
                    payment_method: PaymentMethodEnum.VNPAY,
                    payment_status: PaymentStatusEnum.PENDING,
                    payment_url: paymentData.data.paymentUrl,
                };
            }

            return {
                order_code: orderSaved.code,
                payment_method: PaymentMethodEnum.CASH,
                payment_status: PaymentStatusEnum.PENDING,
                payment_url: null,
            };
        } catch (error) {
            logger.error('Lỗi khi tạo mới.');
            logger.error(error);
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            await queryRunner.release();
        }
    }
}
