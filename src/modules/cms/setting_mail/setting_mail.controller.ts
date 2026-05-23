import { Body, Controller, Get, HttpStatus, Param, Put, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { SettingMailService } from './setting_mail.service';
import { UpdateSettingMailDto } from './dto/update-one-setting_mail.dto';
import { IRequestInfo } from '../../../common/types';

@ApiTags('Cấu hình mail')
@Controller('settingMail')
@UseInterceptors(LoggingInterceptor)
export class SettingMailController {
    constructor(
        private readonly settingMailService: SettingMailService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Lấy dữ liệu cấu hình mail' })
    async findAll(@RequestInfo() requestInfo: IRequestInfo) {
        const data = await this.settingMailService.findSettingMail();
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
        @Body() updateOneDto: UpdateSettingMailDto,
        @RequestInfo() requestInfo: IRequestInfo,
    ) {
        const update = await this.settingMailService.update(id, updateOneDto);
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
