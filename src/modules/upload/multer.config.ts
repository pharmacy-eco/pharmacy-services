import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { Readable } from 'stream';

const validFileExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

export const multerConfig: MulterOptions = {
    fileFilter: (req, file, cb) => {
        const fileExt = extname(file.originalname).toLowerCase();
        const isValidExtension = validFileExtensions.includes(fileExt);
        const isValidMimeType = validMimeTypes.includes(file.mimetype);

        if (!isValidExtension || !isValidMimeType) {
            return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
};

export function toStream(buffer: Buffer): Readable {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}
