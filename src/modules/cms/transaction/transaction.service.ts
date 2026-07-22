import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import logger from './../../../common/logger';
import { Transaction } from './../../../entity/transaction.entity';
import { PaymentHistory } from './../../../entity/payment_history.entity';
import { CreateTransactionDto } from './dto/create_transaction_detail.dto';
import { Orders } from './../../../entity/orders.entity';
import { PaymentMethodEnum, PaymentStatusEnum } from './../../../common/enum';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(PaymentHistory)
        private paymentHistoryRepository: Repository<PaymentHistory>,
    ) {}

    async createCashPayment(order: Orders, amount: number, manager?: EntityManager) {
        const entityManager = manager || this.transactionRepository.manager;

        const transaction = entityManager.create(Transaction, {
            order_id: order.id,
            orderCode: order.code,
            paymentMethod: PaymentMethodEnum.CASH,
            amount,
            transactionStatus: PaymentStatusEnum.PENDING,
        });

        const savedTransaction = await entityManager.save(Transaction, transaction);

        const paymentHistory = entityManager.create(PaymentHistory, {
            order_id: order.id,
            transaction_id: savedTransaction.id,
            orderCode: order.code,
            paymentMethod: PaymentMethodEnum.CASH,
            paymentStatus: PaymentStatusEnum.PENDING,
            amount,
        });

        await entityManager.save(PaymentHistory, paymentHistory);

        return savedTransaction;
    }

    async createVnpayPendingPayment(order: Orders, amount: number) {
        try {
            const existingTransaction = await this.transactionRepository.findOne({
                where: {
                    orderCode: order.code,
                    paymentMethod: PaymentMethodEnum.VNPAY,
                },
            });

            if (existingTransaction) {
                return existingTransaction;
            }

            let data: Transaction;

            await this.transactionRepository.manager.transaction(async (entityManager: EntityManager) => {
                const transaction = entityManager.create(Transaction, {
                    order_id: order.id,
                    orderCode: order.code,
                    paymentMethod: PaymentMethodEnum.VNPAY,
                    amount,
                    transactionStatus: PaymentStatusEnum.PENDING,
                });

                const savedTransaction = await entityManager.save(Transaction, transaction);

                const paymentHistory = entityManager.create(PaymentHistory, {
                    order_id: order.id,
                    transaction_id: savedTransaction.id,
                    orderCode: order.code,
                    paymentMethod: PaymentMethodEnum.VNPAY,
                    paymentStatus: PaymentStatusEnum.PENDING,
                    amount,
                });

                await entityManager.save(PaymentHistory, paymentHistory);

                data = savedTransaction;
            });

            return data;
        } catch (error) {
            logger.error('Lỗi khi tạo phiên thanh toán vnpay.');
            logger.error(error.stack);
            return null;
        }
    }

    async cancelPayment(orderCode: string) {
        return this.transactionRepository.manager.transaction(async (entityManager: EntityManager) => {
            const order = await entityManager.findOne(Orders, {
                where: { code: orderCode },
                lock: { mode: 'pessimistic_write' },
            });

            if (!order) {
                throw new NotFoundException('Mã đơn hàng không tồn tại');
            }

            const transaction = await entityManager.findOne(Transaction, {
                where: {
                    orderCode,
                    paymentMethod: order.payment_method,
                },
                order: { id: 'DESC' },
                lock: { mode: 'pessimistic_write' },
            });

            if (!transaction) {
                throw new NotFoundException('Phiên giao dịch không tồn tại');
            }

            if (
                order.payment_status === PaymentStatusEnum.SUCCESS ||
                transaction.transactionStatus === PaymentStatusEnum.SUCCESS
            ) {
                throw new ConflictException('Giao dịch đã thanh toán thành công và không thể huỷ');
            }

            const isAlreadyCancelled =
                order.payment_status === PaymentStatusEnum.FAILURE &&
                transaction.transactionStatus === PaymentStatusEnum.FAILURE;

            if (!isAlreadyCancelled) {
                order.payment_status = PaymentStatusEnum.FAILURE;
                transaction.transactionStatus = PaymentStatusEnum.FAILURE;
                transaction.responseCode = 'FE_CANCELLED';

                await entityManager.save(Orders, order);
                const savedTransaction = await entityManager.save(Transaction, transaction);

                const paymentHistory = entityManager.create(PaymentHistory, {
                    order_id: order.id,
                    transaction_id: savedTransaction.id,
                    orderCode: order.code,
                    paymentMethod: savedTransaction.paymentMethod,
                    paymentStatus: PaymentStatusEnum.FAILURE,
                    amount: savedTransaction.amount,
                    responseCode: 'FE_CANCELLED',
                    transactionNo: savedTransaction.transactionNo,
                    payDate: savedTransaction.payDate,
                });

                await entityManager.save(PaymentHistory, paymentHistory);
            }

            return {
                order_code: order.code,
                payment_method: order.payment_method,
                payment_status: PaymentStatusEnum.FAILURE,
                transaction_id: transaction.id,
                transaction_status: PaymentStatusEnum.FAILURE,
                already_cancelled: isAlreadyCancelled,
            };
        });
    }

    async CheckExistAndUpdateTransaction(dataDto: CreateTransactionDto, order: Orders, status: PaymentStatusEnum) {
        try {
            const dataTransactions = await this.transactionRepository.findOne({
                where: {
                    orderCode: dataDto.vnp_TxnRef,
                    paymentMethod: PaymentMethodEnum.VNPAY,
                },
            });

            if (!dataTransactions) {
                return {
                    isExist: false,
                    data: null,
                };
            }

            const updatedTransaction = await this.updateTransaction(dataDto, order, dataTransactions, status);

            return {
                isExist: true,
                data: updatedTransaction,
            };
        } catch (error) {
            logger.error('Lỗi khi lưu lịch sử giao dịch.');
            logger.error(error.stack);
            return false;
        }
    }

    private async updateTransaction(
        createTransactionDto: CreateTransactionDto,
        order: Orders,
        transaction: Transaction,
        status: PaymentStatusEnum,
    ) {
        let data;
        try {
            const amount = Number(createTransactionDto.vnp_Amount || 0) / 100;

            if (
                transaction.transactionNo === String(createTransactionDto.vnp_TransactionNo) &&
                transaction.transactionStatus === status
            ) {
                return transaction;
            }

            const create = this.transactionRepository.create({
                ...transaction,
                order_id: order.id,
                orderCode: createTransactionDto.vnp_TxnRef,
                paymentMethod: PaymentMethodEnum.VNPAY,
                amount: transaction.amount || amount,
                payDate: createTransactionDto.vnp_PayDate,
                transactionNo: String(createTransactionDto.vnp_TransactionNo),
                transactionStatus: status,
                responseCode: String(createTransactionDto.vnp_ResponseCode),
            });

            const createDetail = this.paymentHistoryRepository.create({
                order_id: order.id,
                orderCode: createTransactionDto.vnp_TxnRef,
                bankCode: createTransactionDto.vnp_BankCode,
                paymentMethod: PaymentMethodEnum.VNPAY,
                paymentStatus: status,
                amount,
                bankTranNo: createTransactionDto.vnp_BankTranNo,
                cardType: createTransactionDto.vnp_CardType,
                orderInfo: createTransactionDto.vnp_OrderInfo,
                responseCode: String(createTransactionDto.vnp_ResponseCode),
                transactionNo: String(createTransactionDto.vnp_TransactionNo),
                payDate: createTransactionDto.vnp_PayDate,
            });

            await this.transactionRepository.manager.transaction(async (entityManager: EntityManager) => {
                const dataTransaction = await entityManager.save(Transaction, create);

                const dataTransactionDetail = entityManager.create(PaymentHistory, {
                    ...createDetail,
                    transaction_id: dataTransaction.id,
                });
                await entityManager.save(dataTransactionDetail);

                if (!dataTransaction) {
                    throw new Error('Lỗi khi lưu lịch sử giao dịch!');
                }

                data = dataTransaction;
            });

            return data;
        } catch (error) {
            logger.error('Lỗi khi lưu lịch sử giao dịch.');
            logger.error(error.stack);
            return null;
        }
    }
}
