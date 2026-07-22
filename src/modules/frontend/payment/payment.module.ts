import { Module } from '@nestjs/common';
import { ResponseService } from '../../../common/response/response.service';
import { VnpayModule } from '../../vnpay/vnpay.module';
import { TransactionModule } from '../../cms/transaction/transaction.module';
import { FrontendPaymentController } from './payment.controller';
import { PaymentReturnController } from './payment-return.controller';

@Module({
    imports: [VnpayModule, TransactionModule],
    controllers: [FrontendPaymentController, PaymentReturnController],
    providers: [ResponseService],
})
export class FrontendPaymentModule {}
