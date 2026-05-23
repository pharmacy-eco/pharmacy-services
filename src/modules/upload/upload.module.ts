import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ResponseService } from '../../common/response/response.service';
import { CloudinaryConfigService } from './cloudinary.config';

@Module({
    controllers: [UploadController],
    providers: [UploadService, ResponseService, CloudinaryConfigService],
})
export class UploadModule {}
