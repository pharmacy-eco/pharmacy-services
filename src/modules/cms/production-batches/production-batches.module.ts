import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { ProductionBatches } from '../../../entity/production_batches.entity';
import { ProductionBatchesController } from './production-batches.controller';
import { ProductionBatchesService } from './production-batches.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductionBatches])],
    controllers: [ProductionBatchesController],
    providers: [ProductionBatchesService, ResponseService],
    exports: [ProductionBatchesService],
})
export class ProductionBatchesModule {}
