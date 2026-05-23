import { formatDateTime } from '../../../../utils/datetime.util';
import { Blogs } from '../../../../entity/blogs.entity';

export class BlogsListDto {
    id: number;
    title: string;
    slug: string;
    status: number;
    created_at: string;
    updated_at: string;

    constructor(blog: Blogs) {
        this.id = blog.id;
        this.title = blog.title;
        this.slug = blog.slug;
        this.status = blog.status;
        this.created_at = blog.created_at ? formatDateTime(blog.created_at) : '';
        this.updated_at = blog.updated_at ? formatDateTime(blog.updated_at) : '';
    }
}
