import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blogs } from '../../../entity/blogs.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Blogs])],
    controllers: [BlogsController],
    providers: [BlogsService, ResponseService],
    exports: [BlogsService],
})
export class BlogsModule {}
