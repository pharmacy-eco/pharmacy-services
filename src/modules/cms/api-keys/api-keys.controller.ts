import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { IRequestInfo } from '../../../common/types';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { FilterApiKeyDto } from './dto/filter-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

@ApiTags('Quản lý API key AI')
@Controller('api-keys')
@UseInterceptors(LoggingInterceptor)
export class ApiKeysController {
    constructor(
        private readonly apiKeysService: ApiKeysService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách API key AI' })
    async findAll(@Query() payload: FilterApiKeyDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.apiKeysService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Lấy danh sách API key thành công',
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
    @ApiOperation({ summary: 'Chi tiết API key AI' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.apiKeysService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'API key không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        return this.responseService.createResponse(
            200,
            'Chi tiết API key',
            requestInfo.requestId,
            requestInfo.at,
            data,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Thêm mới API key AI' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createDto: CreateApiKeyDto, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.apiKeysService.create(createDto);
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
    @ApiOperation({ summary: 'Cập nhật API key AI' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateDto: UpdateApiKeyDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const data = await this.apiKeysService.update(id, updateDto);
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

    @Patch(':id/reset-token')
    @ApiOperation({ summary: 'Reset số token đã dùng của API key AI' })
    async resetTokenUsed(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.apiKeysService.resetTokenUsed(id);
        if (data) {
            return this.responseService.createResponse(
                200,
                'Reset token thành công',
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
    @ApiOperation({ summary: 'Xóa API key AI' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.apiKeysService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                404,
                'API key không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        await this.apiKeysService.delete(id);

        return this.responseService.createResponse(
            200,
            'Xóa API key thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
