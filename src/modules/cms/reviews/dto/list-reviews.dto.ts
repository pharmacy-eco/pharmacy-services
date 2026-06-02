import { Reviews } from '../../../../entity/reviews.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

export class ReviewsListDto {
    id: number;
    name: string;
    content: string;
    product_id: number;
    product_name: string;
    star: number;
    status: number;
    created_at: string;

    constructor(review: Reviews) {
        this.id = review.id;
        this.name = review.name;
        this.content = review.content;
        this.product_id = review.product_id;
        this.product_name = review.product?.name || '';
        this.star = review.star;
        this.status = review.status;
        this.created_at = review.created_at ? formatDateTime(review.created_at) : '';
    }
}
