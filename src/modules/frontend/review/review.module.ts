import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { Reviews } from '../../../entity/reviews.entity';
import { ReviewsController } from './review.controller';
import { ReviewsService } from './review.service';

@Module({
    imports: [TypeOrmModule.forFeature([Reviews])],
    controllers: [ReviewsController],
    providers: [ReviewsService, ResponseService],
    exports: [ReviewsService],
})
export class FrontendReviewModule {}
