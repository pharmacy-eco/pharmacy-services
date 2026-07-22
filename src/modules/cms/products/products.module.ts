import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Products } from '../../../entity/products.entity';
import { ProductsImage } from '../../../entity/products_image.entity';
import { Categories } from '../../../entity/categories.entity';
import { ProductionBatches } from '../../../entity/production_batches.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Products, ProductsImage, Categories, ProductionBatches])],
    controllers: [ProductsController],
    providers: [ProductsService, ResponseService],
    exports: [ProductsService],
})
export class ProductsModule {}
