import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Orders } from '../../../entity/orders.entity';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { OrdersListDto } from './dto/list-orders.dto';
import { UpdateOrdersDto } from './dto/update-orders.dto';

@Injectable({ scope: Scope.REQUEST })
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: FilterOrdersDto) {
        try {
            const {
                name,
                email,
                phone,
                code,
                status,
                payment_method,
                payment_status,
                pageIndex = 1,
                pageSize = 20,
                sort,
            } = payload;

            const queryBuilder = this.ordersRepository
                .createQueryBuilder('orders')
                .leftJoinAndSelect('orders.orderDetail', 'orderDetail')
                .leftJoinAndSelect('orderDetail.products', 'products');

            if (sort) {
                const sortFieldMap = {
                    id: 'orders.id',
                    name: 'orders.name',
                    email: 'orders.email',
                    phone: 'orders.phone',
                    code: 'orders.code',
                    status: 'orders.status',
                    payment_method: 'orders.payment_method',
                    payment_status: 'orders.payment_status',
                    created_at: 'orders.created_at',
                    updated_at: 'orders.updated_at',
                };
                queryBuilder.orderBy(
                    sortFieldMap[sort.field] || 'orders.id',
                    sort.order.toUpperCase() as 'ASC' | 'DESC',
                );
            } else {
                queryBuilder.orderBy('orders.id', 'DESC');
            }

            if (name) queryBuilder.andWhere('orders.name LIKE :name', { name: `%${name}%` });

            if (email) queryBuilder.andWhere('orders.email LIKE :email', { email: `%${email}%` });

            if (phone) queryBuilder.andWhere('orders.phone LIKE :phone', { phone: `%${phone}%` });

            if (code) queryBuilder.andWhere('orders.code LIKE :code', { code: `%${code}%` });

            if (status) queryBuilder.andWhere('orders.status = :status', { status });

            if (payment_method) queryBuilder.andWhere('orders.payment_method = :payment_method', { payment_method });

            if (payment_status) queryBuilder.andWhere('orders.payment_status = :payment_status', { payment_status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const data = entities.map((order) => new OrdersListDto(order));

            return new PageBase(pageIndex, pageSize, totalItems, data);
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách đơn hàng.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const order = await this.ordersRepository
                .createQueryBuilder('orders')
                .leftJoinAndSelect('orders.orderDetail', 'orderDetail')
                .leftJoinAndSelect('orderDetail.products', 'products')
                .where('orders.id = :id', { id })
                .getOne();

            return order ? new OrdersListDto(order) : null;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết đơn hàng');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, updateDto: UpdateOrdersDto) {
        try {
            const currentUser = this.request.user;
            const order = await this.ordersRepository.findOne({ where: { id } });
            if (!order) {
                throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
            }

            const updatedOrder = plainToClass(Orders, {
                ...order,
                ...updateDto,
                updated_by: currentUser?.id,
            });

            const savedData = await this.ordersRepository.save(updatedOrder);
            return savedData;
        } catch (error) {
            logger.error('Lỗi khi cập nhật đơn hàng.');
            logger.error(error.stack);
            return null;
        }
    }

    async delete(id: number) {
        try {
            const currentUser = this.request.user;
            const order = await this.ordersRepository.findOne({ where: { id } });
            if (!order) {
                throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
            }

            const dataUpdate = plainToClass(Orders, {
                ...order,
                status: 2,
                deleted_at: new Date(),
                deleted_by: currentUser?.id,
            });

            await this.ordersRepository.save(dataUpdate);
        } catch (error) {
            logger.error('Lỗi khi xóa đơn hàng.');
            logger.error(error.stack);
            return null;
        }
    }
}
