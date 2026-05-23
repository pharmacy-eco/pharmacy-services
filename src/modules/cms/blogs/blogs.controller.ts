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
import { BlogsService } from './blogs.service';
import { FilterBlogsDto } from './dto/filter-blogs.dto';
import { CreateBlogsDto } from './dto/create-blogs.dto';
import { UpdateBlogsDto } from './dto/update-blogs.dto';

@ApiTags('Quản lý Blogs')
@Controller('blogs')
@UseInterceptors(LoggingInterceptor)
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu.' })
    async findAll(@Query() payload: FilterBlogsDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.blogsService.findAll(payload);
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
    @ApiOperation({ summary: 'Chi tiết' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.blogsService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(404, 'Không tồn tại', requestInfo.requestId, requestInfo.at);
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
    @ApiOperation({ summary: 'Thêm mới' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createCategoryDto: CreateBlogsDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.blogsService.create(createCategoryDto);
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
    @ApiOperation({ summary: 'Cập nhật' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateBlogsDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const data = await this.blogsService.update(id, updateCategoryDto);
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
    @ApiOperation({ summary: 'Xóa' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.blogsService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'Danh mục không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.blogsService.delete(id);

        return this.responseService.createResponse(200, 'Xóa thành công', requestInfo.requestId, requestInfo.at);
    }
}
