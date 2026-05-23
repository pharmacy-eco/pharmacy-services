import { Controller, Get, HttpStatus, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { Public } from './../../../auth/decorators/jwt.decorators';
import { IRequestInfo } from '../../../common/types';
import { filterProductDto } from './DTO/filter-products.dto';
import { SearchService } from './search.service';

@ApiTags('Frontend Search Product')
@Public()
@Controller('web/search')
@UseInterceptors(LoggingInterceptor)
export class SearchController {
    constructor(
        private readonly searchService: SearchService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Tìm kiếm sản phẩm' })
    async findAll(@Query() payload: filterProductDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.searchService.findAll(payload);
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
