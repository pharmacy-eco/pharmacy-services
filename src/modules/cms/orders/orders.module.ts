import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { Orders } from '../../../entity/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Users } from '../../../entity/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Orders, Users])],
    controllers: [OrdersController],
    providers: [OrdersService, ResponseService],
    exports: [OrdersService],
})
export class OrdersModule {}
