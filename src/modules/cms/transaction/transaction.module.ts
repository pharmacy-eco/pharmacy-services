import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from './../../../common/response/response.service';
import { Transaction } from './../../../entity/transaction.entity';
import { PaymentHistory } from './../../../entity/payment_history.entity';
import { TransactionService } from './transaction.service';
import { Orders } from './../../../entity/orders.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction, PaymentHistory, Orders])],
    providers: [TransactionService, ResponseService],
    exports: [TransactionService],
})
export class TransactionModule {}
