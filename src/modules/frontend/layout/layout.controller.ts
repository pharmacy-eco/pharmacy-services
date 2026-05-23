import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { LayoutService } from './layout.service';
import { Public } from './../../../auth/decorators/jwt.decorators';
import { IRequestInfo } from '../../../common/types';

@ApiTags('Frontend Layout')
@Public()
@Controller('web')
@UseInterceptors(LoggingInterceptor)
export class LayoutController {
    constructor(
        private readonly layoutService: LayoutService,
        private readonly responseService: ResponseService,
    ) {}

    @Get('general')
    @ApiOperation({ summary: 'Cấu hình website' })
    async findAll(@RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.layoutService.findLaypout();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy dữ liệu general thành công',
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

    @Get('home')
    @ApiOperation({ summary: 'trang chủ' })
    async findHome(@RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.layoutService.findHome();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy dữ liệu home thành công',
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

    @Get('about')
    @ApiOperation({ summary: 'trang giới thiệu' })
    async findAbout(@RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.layoutService.findAbout();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy dữ liệu about thành công',
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
