import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '../../../auth/decorators/jwt.decorators';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { RequestInfo } from '../../../common/request-info.decorator';
import { ResponseService } from '../../../common/response/response.service';
import { IRequestInfo } from '../../../common/types';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { TransactionService } from '../../cms/transaction/transaction.service';
import { ParamsPaymentDto } from '../../vnpay/dto/params_payment.dto';
import { ReturnPaymentDto } from '../../vnpay/dto/return_payment.dto';
import { VnpayService } from '../../vnpay/vnpay.service';
import { CancelPaymentDto } from './dto/cancel-payment.dto';

@ApiTags('Frontend Payment')
@Public()
@Controller('web/payment')
@UseInterceptors(LoggingInterceptor)
export class FrontendPaymentController {
    constructor(
        private readonly vnpayService: VnpayService,
        private readonly transactionService: TransactionService,
        private readonly responseService: ResponseService,
    ) {}

    @Get('create-pay')
    @ApiOperation({ summary: 'Tạo link thanh toán VNPay' })
    async createPayByQuery(@Query() paymentDto: ParamsPaymentDto, @RequestInfo() requestInfo: IRequestInfo) {
        return this.handleCreatePayment(paymentDto, requestInfo);
    }

    @Post('create-pay')
    @ApiOperation({ summary: 'Tạo link thanh toán VNPay' })
    async createPay(@Body() paymentDto: ParamsPaymentDto, @RequestInfo() requestInfo: IRequestInfo) {
        return this.handleCreatePayment(paymentDto, requestInfo);
    }

    @Post('cancel')
    @ApiOperation({ summary: 'Huỷ giao dịch từ frontend' })
    @UsePipes(new CustomValidationPipe())
    async cancelPayment(@Body() payload: CancelPaymentDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.transactionService.cancelPayment(payload.orderCode);

        return this.responseService.createResponse(
            HttpStatus.OK,
            data.already_cancelled ? 'Giao dịch đã được huỷ trước đó' : 'Huỷ giao dịch thành công',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }

    @Get('vnpay-return')
    @ApiOperation({ summary: 'Nhận kết quả thanh toán VNPay' })
    async vnpayReturnByQuery(@Query() returnPaymentDto: ReturnPaymentDto, @Res() response: Response) {
        return response.redirect(await this.vnpayService.getFrontendReturnUrl(returnPaymentDto));
    }

    @Post('vnpay-return')
    @ApiOperation({ summary: 'Nhận kết quả thanh toán VNPay' })
    async vnpayReturn(@Body() returnPaymentDto: ReturnPaymentDto, @RequestInfo() requestInfo: IRequestInfo) {
        return this.handleVnpayReturn(returnPaymentDto, requestInfo);
    }

    private async handleCreatePayment(paymentDto: ParamsPaymentDto, requestInfo: IRequestInfo) {
        const data = await this.vnpayService.createPaymentUrl(paymentDto);

        if (data) {
            if (data.isError === false) {
                return this.responseService.createResponse(
                    HttpStatus.OK,
                    'Tạo link thanh toán thành công',
                    requestInfo.requestId,
                    requestInfo.at,
                    data.data,
                );
            }

            if (data.isError === true) {
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

    private async handleVnpayReturn(returnPaymentDto: ReturnPaymentDto, requestInfo: IRequestInfo) {
        const data = await this.vnpayService.verifyResponse(returnPaymentDto);

        if (data) {
            if (data.isError === false) {
                return this.responseService.createResponse(
                    HttpStatus.OK,
                    'Thanh toán thành công',
                    requestInfo.requestId,
                    requestInfo.at,
                    data.data,
                );
            }

            if (data.isError === true) {
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
