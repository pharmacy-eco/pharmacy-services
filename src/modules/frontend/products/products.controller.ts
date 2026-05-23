import { Controller, Get, HttpStatus, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { Public } from './../../../auth/decorators/jwt.decorators';
import { IRequestInfo } from '../../../common/types';
import { ProductsService } from './products.service';

@ApiTags('Frontend Product')
@Public()
@Controller('web/product')
@UseInterceptors(LoggingInterceptor)
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly responseService: ResponseService,
    ) {}

    @Get(':slug')
    @ApiOperation({ summary: 'Chi tiết sản phẩm' })
    async findAll(@Param('slug') slug: string, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productsService.findOne(slug);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy dữ liệu thành công',
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
