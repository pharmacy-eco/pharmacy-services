import {
    getRandomElement,
    khenSanPhamThuoc,
    listFirstName,
    listLastNameVn,
    listMiddleNameVn,
    randomName,
    randomReview,
} from '../../utils/name_random';
import { Reviews } from '../../entity/reviews.entity';

export function reviewFactory(productIds: Array<number>): Reviews[] {
    const reviews: Reviews[] = [];

    for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];

        for (let j = 0; j < 5; j++) {
            const review = new Reviews();

            const randomReview = getRandomElement(khenSanPhamThuoc);
            const randomName = `${getRandomElement(listFirstName)} ${getRandomElement(listMiddleNameVn)} ${getRandomElement(listLastNameVn)}`;

            review.content = randomReview;
            review.name = randomName;
            review.product_id = productId;
            review.star = Math.floor(Math.random() * 5) + 1;
            review.created_by = 1;
            review.status = 1;
            reviews.push(review);
        }
    }

    return reviews;
}
