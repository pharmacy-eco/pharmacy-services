import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { Products } from '../../../entity/products.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Products])],
    controllers: [SearchController],
    providers: [SearchService, ResponseService],
    exports: [SearchService],
})
export class FrontendSearchModule {}
