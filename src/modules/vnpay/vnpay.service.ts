import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { ParamsPaymentDto } from './dto/params_payment.dto';
import { ReturnPaymentDto } from './dto/return_payment.dto';
import logger from './../../common/logger';
import { formatDateTime } from './../../utils/datetime.util';
import { Orders } from './../../entity/orders.entity';
import { PaymentMethodEnum, PaymentStatusEnum } from './../../common/enum';
import { TransactionService } from '../cms/transaction/transaction.service';

@Injectable()
export class VnpayService {
    constructor(
        @InjectRepository(Orders)
        private readonly orderRepository: Repository<Orders>,
        private readonly transactionService: TransactionService,
    ) {}

    async createPaymentUrl(paymentDto: ParamsPaymentDto) {
        const orderData = await this.findOrderByCode(paymentDto.orderCode);

        if (!orderData) {
            return {
                isError: true,
                message: 'Ma hoa don khong ton tai',
            };
        }

        const amount = this.getOrderTotal(orderData);
        const transaction = await this.transactionService.createVnpayPendingPayment(orderData, amount);

        if (!transaction) {
            return false;
        }

        await this.orderRepository.update(orderData.id, {
            payment_method: PaymentMethodEnum.VNPAY,
            payment_status: PaymentStatusEnum.PENDING,
        });

        return {
            isError: false,
            data: {
                orderCode: orderData.code,
                amount,
                payment_method: PaymentMethodEnum.VNPAY,
                payment_status: PaymentStatusEnum.PENDING,
                paymentUrl: this.buildPaymentUrl({
                    orderCode: orderData.code,
                    amount,
                    bankCode: paymentDto.bankCode,
                }),
            },
        };
    }

    private buildPaymentUrl(paymentDto: ParamsPaymentDto) {
        const vnpParams: Record<string, string | number> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: process.env.VNP_TmnCode,
            vnp_Amount: Number(paymentDto.amount) * 100,
            vnp_CurrCode: 'VND',
            vnp_TxnRef: paymentDto.orderCode,
            vnp_OrderInfo: `Thanh toan cho hoa don ${paymentDto.orderCode}`,
            vnp_Locale: 'vn',
            vnp_ReturnUrl:
                process.env.VNP_ReturnUrl || `${process.env.APP_URL || 'http://localhost:3001'}/don-hang/thanh-toan/`,
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: this.getFormattedDate(),
            vnp_OrderType: 'other',
        };

        if (paymentDto.bankCode) {
            vnpParams.vnp_BankCode = paymentDto.bankCode;
        }

        const dataHash = this.secureHash(vnpParams);

        return `${process.env.VNP_Url}?${dataHash.queryString}&vnp_SecureHash=${dataHash.signed}`;
    }

    async verifyResponse(vnpParams?: ReturnPaymentDto) {
        try {
            if (!vnpParams) {
                return {
                    isError: true,
                    message: 'Thieu du lieu thanh toan',
                };
            }

            const { vnp_SecureHash, vnp_SecureHashType, ...newParam } = vnpParams as ReturnPaymentDto & {
                vnp_SecureHashType?: string;
            };

            const dataHash = this.secureHash(newParam);

            if (vnp_SecureHash !== dataHash.signed) {
                return {
                    isError: true,
                    message: 'Ma yeu cau thanh toan khong trung khop',
                };
            }

            const orderData = await this.findOrderByCode(vnpParams.vnp_TxnRef);

            if (!orderData) {
                return {
                    isError: true,
                    message: 'Ma hoa don khong ton tai',
                };
            }

            const totalPrice = this.getOrderTotal(orderData);
            const paidAmount = Number(vnpParams.vnp_Amount || 0) / 100;
            const isSuccess =
                vnpParams.vnp_TransactionStatus === '00' &&
                String(vnpParams.vnp_ResponseCode) === '00' &&
                paidAmount === totalPrice;
            const paymentStatus = isSuccess ? PaymentStatusEnum.SUCCESS : PaymentStatusEnum.FAILURE;

            const transactionData = await this.transactionService.CheckExistAndUpdateTransaction(
                vnpParams,
                orderData,
                paymentStatus,
            );
            if (!transactionData) {
                return false;
            }

            if (!transactionData.isExist) {
                return {
                    isError: true,
                    message: 'Phien thanh toan khong ton tai',
                };
            }

            await this.orderRepository.update(orderData.id, {
                payment_method: PaymentMethodEnum.VNPAY,
                payment_status: paymentStatus,
            });

            return {
                isError: false,
                data: {
                    code: orderData.code,
                    transactionCode: vnpParams.vnp_TransactionNo,
                    price: totalPrice,
                    paidAmount,
                    payment_method: PaymentMethodEnum.VNPAY,
                    status: paymentStatus,
                    created_at: orderData.created_at ? formatDateTime(orderData.created_at) : '',
                },
            };
        } catch (error) {
            logger.error('Loi khi thanh toan qua vnpay.');
            logger.error(error);
            return false;
        }
    }

    async getFrontendReturnUrl(vnpParams: ReturnPaymentDto) {
        const result = await this.verifyResponse(vnpParams);
        const searchParams = new URLSearchParams(vnpParams as unknown as Record<string, string>);

        if (!result || result.isError) {
            searchParams.set('vnp_ResponseCode', searchParams.get('vnp_ResponseCode') === '24' ? '24' : '97');
            searchParams.set('payment_status', 'FAILED');
        }

        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
        return `${frontendUrl}/don-hang/thanh-toan?${searchParams.toString()}`;
    }

    private getOrderTotal(order: Orders) {
        return (order.orderDetail || []).reduce((total, detail) => {
            return total + Number(detail.quantity || 0) * Number(detail.price || 0);
        }, 0);
    }

    private findOrderByCode(code: string) {
        return this.orderRepository
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.orderDetail', 'orderDetail')
            .leftJoinAndSelect('orderDetail.products', 'products')
            .where('orders.code = :code', { code })
            .getOne();
    }

    private sortObject(obj: Record<string, string | number>) {
        return Object.keys(obj)
            .filter((key) => obj[key] !== undefined && obj[key] !== null && obj[key] !== '')
            .sort()
            .reduce((result: Record<string, string | number>, key: string) => {
                result[key] = obj[key];
                return result;
            }, {});
    }

    private getFormattedDate() {
        const date = new Date();
        return `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(
            -2,
        )}${('0' + date.getHours()).slice(-2)}${('0' + date.getMinutes()).slice(
            -2,
        )}${('0' + date.getSeconds()).slice(-2)}`;
    }

    private secureHash(vnpParams: Record<string, string | number>) {
        const sortedParams = this.sortObject(vnpParams);
        const queryString = new URLSearchParams(sortedParams as Record<string, string>).toString();
        const hmac = crypto.createHmac('sha512', process.env.VNP_HashSecret);
        const signed = hmac.update(Buffer.from(queryString, 'utf-8')).digest('hex');

        return {
            queryString,
            signed,
        };
    }
}
