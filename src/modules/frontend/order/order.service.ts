import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { Orders } from '../../../entity/orders.entity';
import { CreateDtoOrder } from './DTO/create.dto';
import { OrderDetail } from '../../../entity/order_detail.entity';
import { Products } from '../../../entity/products.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private orderRepository: Repository<Orders>,
    ) {}

    async create(payload: CreateDtoOrder) {
        const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const order = this.orderRepository.create({
                address: payload.address,
                email: payload.email,
                name: payload.name,
                phone: payload.phone,
                code: uuidv4(),
                status: 1,
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

            await queryRunner.commitTransaction();

            return orderSaved.code;
        } catch (error) {
            logger.error('Lỗi khi tạo mới.');
            logger.error(error.stack);
            await queryRunner.rollbackTransaction();
            return null;
        } finally {
            await queryRunner.release();
        }
    }
}
