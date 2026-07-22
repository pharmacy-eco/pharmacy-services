import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Products } from '../../../entity/products.entity';
import { Reviews } from '../../../entity/reviews.entity';
import { Categories } from '../../../entity/categories.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Products, Reviews, Categories])],
    controllers: [ProductsController],
    providers: [ProductsService, ResponseService],
    exports: [ProductsService],
})
export class FrontendProductsModule {}
