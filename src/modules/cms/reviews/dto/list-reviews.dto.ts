import { Reviews } from '../../../../entity/reviews.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

export class ReviewsListDto {
    id: number;
    name: string;
    status: number;
    created_at: string;

    constructor(review: Reviews) {
        this.id = review.id;
        this.name = review.name;
        this.status = review.status;
        this.created_at = review.created_at ? formatDateTime(review.created_at) : '';
    }
}
