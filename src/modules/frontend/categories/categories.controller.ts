import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../auth/decorators/jwt.decorators';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { RequestInfo } from '../../../common/request-info.decorator';
import { ResponseService } from '../../../common/response/response.service';
import { IRequestInfo } from '../../../common/types';
import { CategoriesService } from './categories.service';
import { FeaturedCategoriesApiResponseDto } from './DTO/featured-category-response.dto';

@ApiTags('Frontend Category')
@Public()
@Controller('web/category')
@UseInterceptors(LoggingInterceptor)
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly responseService: ResponseService,
    ) {}

    @Get('featured')
    @ApiOperation({ summary: 'Danh sách danh mục sản phẩm nổi bật' })
    @ApiOkResponse({ description: 'Danh sách danh mục nổi bật', type: FeaturedCategoriesApiResponseDto })
    async findFeatured(@RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.categoriesService.findFeatured();

        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy dữ liệu thành công',
                requestInfo.requestId,
                requestInfo.at,
                data,
            );
        }

        return this.responseService.createResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Lỗi không xác định. Vui lòng thử lại sau',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
