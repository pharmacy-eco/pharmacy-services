import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { IRequestInfo } from '../../../common/types';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { CreateProductionBatchDto } from './dto/create-production-batch.dto';
import { FilterProductionBatchDto } from './dto/filter-production-batch.dto';
import { UpdateProductionBatchDto } from './dto/update-production-batch.dto';
import { ProductionBatchesService } from './production-batches.service';

@ApiTags('Quản lý lô sản xuất')
@Controller('production-batches')
@UseInterceptors(LoggingInterceptor)
export class ProductionBatchesController {
    constructor(
        private readonly productionBatchesService: ProductionBatchesService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu lô sản xuất' })
    async findAll(@Query() payload: FilterProductionBatchDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productionBatchesService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Lấy danh sách thành công',
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

    @Get(':id')
    @ApiOperation({ summary: 'Chi tiết lô sản xuất' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productionBatchesService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'Lô sản xuất không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        return this.responseService.createResponse(
            200,
            'Chi tiết lô sản xuất',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Thêm mới lô sản xuất' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createDto: CreateProductionBatchDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productionBatchesService.create(createDto);
        if (data) {
            return this.responseService.createResponse(
                201,
                'Thêm mới thành công',
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

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật lô sản xuất' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateDto: UpdateProductionBatchDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const data = await this.productionBatchesService.update(id, updateDto);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Cập nhật thành công',
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

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa lô sản xuất' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.productionBatchesService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'Lô sản xuất không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        await this.productionBatchesService.delete(id);

        return this.responseService.createResponse(
            200,
            'Xóa lô sản xuất thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
