import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { ApiKeys } from '../../../entity/api_keys.entity';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';

@Module({
    imports: [TypeOrmModule.forFeature([ApiKeys])],
    controllers: [ApiKeysController],
    providers: [ApiKeysService, ResponseService],
    exports: [ApiKeysService],
})
export class ApiKeysModule {}
