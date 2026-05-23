import { Controller, HttpStatus, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { multerConfig } from './multer.config';
import { UploadService } from './upload.service';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../common/response/response.service';
import { RequestInfo } from '../../common/request-info.decorator';
import { IRequestInfo } from '../../common/types';

@ApiTags('Upload')
@Controller('uploads')
@UseInterceptors(LoggingInterceptor)
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly responseService: ResponseService,
    ) {}

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
    async uploadFile(@UploadedFiles() files: Express.Multer.File[], @RequestInfo() requestInfo: IRequestInfo) {
        try {
            const fileLink = await this.uploadService.uploadFile(files);

            return this.responseService.createResponse(
                HttpStatus.OK,
                'Upload file thành công',
                requestInfo.requestId,
                requestInfo.at,
                { url: fileLink },
            );
        } catch (error) {
            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi khi upload ảnh: ' + error.message,
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }
}
