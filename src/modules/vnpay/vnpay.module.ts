import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../common/response/response.service';
import { VnpayService } from './vnpay.service';
import { PaymentController } from './vnpay.controller';
import { Orders } from './../../entity/orders.entity';
import { TransactionModule } from '../cms/transaction/transaction.module';

@Module({
    imports: [TypeOrmModule.forFeature([Orders]), TransactionModule],
    controllers: [PaymentController],
    providers: [VnpayService, ResponseService],
    exports: [VnpayService],
})
export class VnpayModule {}
