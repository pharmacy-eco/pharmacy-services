import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { General } from './../../../entity/general.entity';
import { LayoutService } from './layout.service';
import { LayoutController } from './layout.controller';
import { Categories } from '../../../entity/categories.entity';
import { Products } from '../../../entity/products.entity';
import { Blogs } from '../../../entity/blogs.entity';
import { Banners } from '../../../entity/banners.entity';

@Module({
    imports: [TypeOrmModule.forFeature([General, Categories, Products, Blogs, Banners])],
    controllers: [LayoutController],
    providers: [LayoutService, ResponseService],
    exports: [LayoutService],
})
export class FrontendLayoutModule {}
