import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
    createResponse<T>(code: number, message: string, requestId: string, at: string, data?: T) {
        return {
            requestId,
            at,
            error: {
                code: code || 1,
                message: message || 'Lỗi không xác định. Vui lòng thử lại sau',
            },
            data,
        };
    }
}
