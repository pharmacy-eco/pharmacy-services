import { Controller, Get, HttpStatus, Param, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { Public } from './../../../auth/decorators/jwt.decorators';
import { IRequestInfo } from '../../../common/types';
import { ProductsService } from './products.service';
import { FilterProductsByCategoryDto } from './DTO/filter-products-by-category.dto';
import { ProductListApiResponseDto } from './DTO/product-list-response.dto';

@ApiTags('Frontend Product')
@Public()
@Controller('web/product')
@UseInterceptors(LoggingInterceptor)
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly responseService: ResponseService,
    ) {}

    @Get('category/:categorySlug')
    @ApiOperation({ summary: 'Danh sách sản phẩm theo danh mục' })
    @ApiParam({ name: 'categorySlug', description: 'Slug của danh mục sản phẩm' })
    @ApiOkResponse({ description: 'Danh sách sản phẩm và thông tin phân trang', type: ProductListApiResponseDto })
    @ApiNotFoundResponse({ description: 'Không tìm thấy danh mục sản phẩm' })
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async findByCategory(
        @Param('categorySlug') categorySlug: string,
        @Query() payload: FilterProductsByCategoryDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const data = await this.productsService.findByCategory(categorySlug, payload);

        if (data === undefined) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Không tìm thấy danh mục sản phẩm',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

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
