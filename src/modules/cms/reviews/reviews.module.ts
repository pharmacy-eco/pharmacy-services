import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { Reviews } from '../../../entity/reviews.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
    imports: [TypeOrmModule.forFeature([Reviews])],
    controllers: [ReviewsController],
    providers: [ReviewsService, ResponseService],
    exports: [ReviewsService],
})
export class ReviewsModule {}
