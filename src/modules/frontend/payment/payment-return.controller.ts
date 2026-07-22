import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '../../../auth/decorators/jwt.decorators';
import { ReturnPaymentDto } from '../../vnpay/dto/return_payment.dto';
import { VnpayService } from '../../vnpay/vnpay.service';

@ApiTags('Frontend Payment')
@Public()
@Controller('don-hang/thanh-toan')
export class PaymentReturnController {
    constructor(private readonly vnpayService: VnpayService) {}

    @Get()
    @ApiOperation({ summary: 'Xử lý URL trả về từ VNPay' })
    async vnpayReturn(@Query() returnPaymentDto: ReturnPaymentDto, @Res() response: Response) {
        return response.redirect(await this.vnpayService.getFrontendReturnUrl(returnPaymentDto));
    }
}
