import { Reviews } from '../../entity/reviews.entity';
import { DataSource } from 'typeorm';
import { reviewFactory } from '../factories/review.factory';
import { Products } from '../../entity/products.entity';

export async function seedReview(dataSource: DataSource) {
    const reviewRepository = dataSource.getRepository(Reviews);
    const productRepository = dataSource.getRepository(Products);

    const products = await productRepository.find();

    const productIds = products.map((pro) => pro.id);

    const data = reviewFactory(productIds);
    await reviewRepository.save(data);

    console.log('Seed đánh giá thành công!');
}
