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
import { CategoriesService } from './categories.service';
import { IRequestInfo } from '../../../common/types';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Quản lý danh mục')
@Controller('categories')
@UseInterceptors(LoggingInterceptor)
export class CategoriesController {
    constructor(
        private readonly categoryService: CategoriesService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu danh mục' })
    async findAll(@Query() payload: FilterCategoryDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.categoryService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Lấy danh sách người dùng thành công',
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

    @Get('parent')
    @ApiOperation({ summary: 'Lấy dữ liệu danh mục' })
    async findAllParent(@RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.categoryService.findAllParent();
        if (data) {
            return this.responseService.createResponse(
                200,
                'Lấy danh sách dữ liệu',
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
    @ApiOperation({ summary: 'Chi tiết danh mục' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.categoryService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'Danh mục không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        return this.responseService.createResponse(
            200,
            'Chi tiết danh mục',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Thêm mới danh mục' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createCategoryDto: CreateCategoryDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.categoryService.create(createCategoryDto);
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
    @ApiOperation({ summary: 'Cập nhật danh mục' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const data = await this.categoryService.update(id, updateCategoryDto);
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
    @ApiOperation({ summary: 'Xóa danh mục' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.categoryService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'Danh mục không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.categoryService.delete(id);

        return this.responseService.createResponse(
            200,
            'Xóa danh mục thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
