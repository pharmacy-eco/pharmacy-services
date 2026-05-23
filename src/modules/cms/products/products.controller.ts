import {
    Controller,
    Get,
    Post,
    HttpStatus,
    UseInterceptors,
    Query,
    Param,
    Body,
    UsePipes,
    Put,
    Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { IRequestInfo } from '../../../common/types';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { ProductsService } from './products.service';
import { FilterProductsDto } from './dto/filter-products.dto';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';

@ApiTags('Quản lý sản phẩm')
@Controller('products')
@UseInterceptors(LoggingInterceptor)
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu sản phẩm' })
    async findAll(@Query() payload: FilterProductsDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productsService.findAll(payload);
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
    @ApiOperation({ summary: 'Chi tiết sản phẩm' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productsService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'sản phẩm không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        return this.responseService.createResponse(
            200,
            'Chi tiết sản phẩm',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Thêm mới sản phẩm' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createCategoryDto: CreateProductsDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productsService.create(createCategoryDto);
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

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật sản phẩm' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateProductsDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const data = await this.productsService.update(id, updateCategoryDto);
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
    @ApiOperation({ summary: 'Xóa sản phẩm' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productsService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'sản phẩm không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.productsService.delete(id);

        return this.responseService.createResponse(
            200,
            'Xóa sản phẩm thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
