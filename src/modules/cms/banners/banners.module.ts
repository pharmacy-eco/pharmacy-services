import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { Banners } from '../../../entity/banners.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Banners])],
    controllers: [BannersController],
    providers: [BannersService, ResponseService],
    exports: [BannersService],
})
export class BannersModule {}
