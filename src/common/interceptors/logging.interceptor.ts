/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        request.requestId = uuidv4();
        request.at = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        return next.handle().pipe(catchError((error) => this.handleError(error, request)));
    }

    private handleError(error: any, request: any): Observable<any> {
        switch (true) {
            case this.isBadRequest(error):
            case this.isConflictError(error):
                return this.handleClientError(error, request);
            default:
                this.logError(error);
                return throwError(error);
        }
    }

    private isBadRequest(error: any): boolean {
        return error instanceof BadRequestException;
    }

    private isConflictError(error: any): boolean {
        return error instanceof ConflictException;
    }

    private handleClientError(error: any, request: any): Observable<any> {
        const errorMessage = this.extractErrorMessage(error);
        const statusCode = error.getStatus();
        const requestId = request.requestId;
        const at = request.at;

        const result = {
            requestId,
            at,
            error: {
                message: errorMessage,
                statusCode,
            },
        };

        logger.error(JSON.stringify(result));
        return of(result);
    }

    private extractErrorMessage(error: any): string {
        const response = error.getResponse();
        return typeof response === 'object' && response !== null && 'message' in response
            ? response.message
            : 'Bad Request';
    }

    private logError(error: any): void {
        logger.error(
            JSON.stringify({
                name: error?.name || 'Error',
                message: error?.message || 'Unexpected error',
                statusCode: typeof error?.getStatus === 'function' ? error.getStatus() : 500,
                response: typeof error?.getResponse === 'function' ? error.getResponse() : undefined,
                stack: error?.stack,
            }),
        );
    }
}
