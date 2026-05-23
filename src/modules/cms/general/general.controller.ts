import { Body, Controller, Get, HttpStatus, Param, Put, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { IRequestInfo } from '../../../common/types';
import { GeneralService } from './general.service';
import { UpdateGeneralDto } from './dto/update-one-general.dto';

@ApiTags('Cấu hình chung')
@Controller('general')
@UseInterceptors(LoggingInterceptor)
export class GeneralController {
    constructor(
        private readonly generalService: GeneralService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu cấu hình' })
    async findAll(@RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.generalService.findOne();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy dữ liệu cấu hình thành công',
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
    @ApiOperation({ summary: 'Cập nhật cấu hình chung' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateOneDto: UpdateGeneralDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const update = await this.generalService.update(id, updateOneDto);
        if (update) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Cập nhật thành công',
                requestInfo.requestId,
                requestInfo.at,
                update,
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
