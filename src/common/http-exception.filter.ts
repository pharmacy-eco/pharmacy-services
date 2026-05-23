import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message = '';
        let error = '';

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = exceptionResponse as any;
            message = res.message || '';
            error = res.error || '';
        }

        response.status(status).json({
            status_code: status, // 👈 custom ở đây
            message,
            error,
        });
    }
}
