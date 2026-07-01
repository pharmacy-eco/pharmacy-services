import { formatDateTime } from '../../../../utils/datetime.util';
import { Blogs } from '../../../../entity/blogs.entity';

export class BlogsListDto {
    id: number;
    title: string;
    image: string;
    slug: string;
    status: number;
    category_id: number;
    description: string;
    content: string;
    meta_title: string;
    meta_description: string;
    created_at: string;
    updated_at: string;
    category_name: string;

    constructor(blog: Blogs) {
        this.id = blog.id;
        this.title = blog.title;
        this.slug = blog.slug;
        this.status = blog.status;
        this.image = blog.image;
        this.category_id = blog.category_id;
        this.description = blog.description;
        this.content = blog.content;
        this.meta_title = blog.meta_title;
        this.meta_description = blog.meta_description;
        this.category_name = blog.category?.name ? blog.category.name : '';
        this.created_at = blog.created_at ? formatDateTime(blog.created_at) : '';
        this.updated_at = blog.updated_at ? formatDateTime(blog.updated_at) : '';
    }
}
