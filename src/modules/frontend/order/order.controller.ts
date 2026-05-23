import { Body, Controller, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { Public } from './../../../auth/decorators/jwt.decorators';
import { IRequestInfo } from '../../../common/types';
import { OrdersService } from './order.service';
import { CreateDtoOrder } from './DTO/create.dto';

@ApiTags('Frontend Order')
@Public()
@Controller('web/order')
@UseInterceptors(LoggingInterceptor)
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly responseService: ResponseService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Thêm mới đơn hàng' })
    async create(@Body() payload: CreateDtoOrder, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.ordersService.create(payload);
        if (data) {
            return this.responseService.createResponse(
                201,
                'Thêm mới thành công',
                requestInfo.requestId,
                requestInfo.at,
                data,
            );
        } else {
            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }
}
