import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfigService } from './cloudinary.config';
import { toStream } from './multer.config';

@Injectable()
export class UploadService {
    constructor(private readonly cloudinaryConfigService: CloudinaryConfigService) {
        this.cloudinaryConfigService.configure();
    }

    async uploadFile(files: Express.Multer.File[]) {
        const uploadPromises = files.map(async (file) => {
            return new Promise((resolve, reject) => {
                const upload = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                toStream(file.buffer).pipe(upload);
            });
        });

        return Promise.all(uploadPromises);
    }
}
