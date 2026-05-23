import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { Orders } from '../../../entity/orders.entity';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { OrderDetail } from '../../../entity/order_detail.entity';
import { Products } from '../../../entity/products.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Orders, OrderDetail, Products])],
    controllers: [OrdersController],
    providers: [OrdersService, ResponseService],
    exports: [OrdersService],
})
export class FrontendOrdersModule {}
