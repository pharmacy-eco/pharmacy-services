import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { ParamsPaymentDto } from './dto/params_payment.dto';
import { ReturnPaymentDto } from './dto/return_payment.dto';
import { ResponseService } from './../../common/response/response.service';
import { RequestInfo } from './../../common/request-info.decorator';
import { Public } from './../../auth/decorators/jwt.decorators';

@Public()
@Controller('payment')
export class PaymentController {
    constructor(
        private readonly vnpayService: VnpayService,
        private readonly responseService: ResponseService,
    ) {}

    @Get('create')
    async createPayment(@Query() paymentDto: ParamsPaymentDto, @RequestInfo() requestInfo) {
        return this.handleCreatePayment(paymentDto, requestInfo);
    }

    @Get('create-pay')
    async createPayByQuery(@Query() paymentDto: ParamsPaymentDto, @RequestInfo() requestInfo) {
        return this.handleCreatePayment(paymentDto, requestInfo);
    }

    @Post('create-pay')
    async createPay(@Body() paymentDto: ParamsPaymentDto, @RequestInfo() requestInfo) {
        return this.handleCreatePayment(paymentDto, requestInfo);
    }

    @Get('vnpay-return')
    async vnpayReturnByQuery(@Query() returnPaymentDto: ReturnPaymentDto, @RequestInfo() requestInfo) {
        return this.handleVnpayReturn(returnPaymentDto, requestInfo);
    }

    @Post('vnpay-return')
    async vnpayReturn(@Body() returnPaymentDto: ReturnPaymentDto, @RequestInfo() requestInfo) {
        return this.handleVnpayReturn(returnPaymentDto, requestInfo);
    }

    private async handleVnpayReturn(returnPaymentDto: ReturnPaymentDto, requestInfo) {
        const data = await this.vnpayService.verifyResponse(returnPaymentDto);
        if (data) {
            if (data.isError == false) {
                return this.responseService.createResponse(
                    HttpStatus.OK,
                    'Thanh toán thành công',
                    requestInfo.requestId,
                    requestInfo.at,
                    data.data,
                );
            }
            if (data.isError == true) {
                return this.responseService.createResponse(
                    HttpStatus.OK,
                    data.message,
                    requestInfo.requestId,
                    requestInfo.at,
                );
            }
        } else {
            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }

    private async handleCreatePayment(paymentDto: ParamsPaymentDto, requestInfo) {
        const data = await this.vnpayService.createPaymentUrl(paymentDto);
        if (data) {
            if (data.isError == false) {
                return this.responseService.createResponse(
                    HttpStatus.OK,
                    'Tao link thanh toan thanh cong',
                    requestInfo.requestId,
                    requestInfo.at,
                    data.data,
                );
            }

            if (data.isError == true) {
                return this.responseService.createResponse(
                    HttpStatus.OK,
                    data.message,
                    requestInfo.requestId,
                    requestInfo.at,
                );
            }
        }

        return this.responseService.createResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Lỗi không xác định. Vui lòng thử lại sau',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
