import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UploadService {
    constructor() {}

    getFileLink(fileName: string): string {
        // Trả về đường link của file
        return `/uploads/${fileName}`;
    }
}
