import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Blogs } from '../../../entity/blogs.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlogsService {
    constructor(
        @InjectRepository(Blogs)
        private blogsRepository: Repository<Blogs>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findOne(slug: string) {
        try {
            const data = await this.blogsRepository.findOne({
                where: { status: 1, slug: slug },
                select: ['id', 'content', 'description', 'meta_title', 'meta_description', 'slug', 'meta_title'],
            });
            return data;
        } catch (error) {
            logger.error('Lỗi khi lấy dữ liệu.');
            logger.error(error.stack);
            return null;
        }
    }
}
