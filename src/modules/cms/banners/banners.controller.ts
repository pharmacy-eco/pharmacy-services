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
import { BannersService } from './banners.service';
import { FilterBannersDto } from './dto/filter-banners.dto';
import { CreateBannersDto } from './dto/create-banners.dto';
import { UpdateBannersDto } from './dto/update-banners.dto';

@ApiTags('Quản lý Banner')
@Controller('banners')
@UseInterceptors(LoggingInterceptor)
export class BannersController {
    constructor(
        private readonly bannersService: BannersService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu.' })
    async findAll(@Query() payload: FilterBannersDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.bannersService.findAll(payload);
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
        const data = await this.bannersService.findOne(id);
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
    async create(@Body() createCategoryDto: CreateBannersDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.bannersService.create(createCategoryDto);
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
        @Body() updateCategoryDto: UpdateBannersDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const data = await this.bannersService.update(id, updateCategoryDto);
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
        const data = await this.bannersService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'Danh mục không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.bannersService.delete(id);

        return this.responseService.createResponse(200, 'Xóa thành công', requestInfo.requestId, requestInfo.at);
    }
}
