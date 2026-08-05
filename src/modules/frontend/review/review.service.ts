import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CreateDtoReview } from './DTO/create.dto';
import { Reviews } from '../../../entity/reviews.entity';

@Injectable({ scope: Scope.REQUEST })
export class ReviewsService {
    constructor(
        @InjectRepository(Reviews)
        private reviewsRepository: Repository<Reviews>,
    ) {}

    async create(payload: CreateDtoReview) {
        try {
            const review = new Reviews();
            review.content = payload.content;
            review.product_id = payload.product_id;
            review.name = payload.name;
            review.star = payload.star;
            review.status = 1;
            const dataSaved = await this.reviewsRepository.save(review);
            return dataSaved;
        } catch (error) {
            logger.error('Lỗi khi tạo mới.');
            logger.error(error);
            return null;
        }
    }
}
