import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Put,
    Query,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { RequestInfo } from '../../../common/request-info.decorator';
import { ResponseService } from '../../../common/response/response.service';
import { IRequestInfo } from '../../../common/types';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { UpdateOrdersDto } from './dto/update-orders.dto';
import { OrdersService } from './orders.service';

@ApiTags('Quản lý đơn hàng')
@Controller('orders')
@UseInterceptors(LoggingInterceptor)
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu đơn hàng' })
    async findAll(@Query() payload: FilterOrdersDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.ordersService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Lấy danh sách thành công',
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

    @Get(':id')
    @ApiOperation({ summary: 'Chi tiết đơn hàng' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.ordersService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'đơn hàng không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        return this.responseService.createResponse(
            200,
            'Chi tiết đơn hàng',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateDto: UpdateOrdersDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const order = await this.ordersService.findOne(id);
        if (!order) {
            return this.responseService.createResponse(
                404,
                'đơn hàng không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        const data = await this.ordersService.update(id, updateDto);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Cập nhật thành công',
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

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa đơn hàng' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.ordersService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'đơn hàng không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        await this.ordersService.delete(id);

        return this.responseService.createResponse(
            200,
            'Xóa đơn hàng thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
