import { Categories } from '../../../../entity/categories.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

export class CategoryListDto {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string;
    meta_description: string;
    meta_name: string;
    status: number;
    created_at: string;
    updated_at: string;
    parent: {
        id: number;
        name: string;
    };

    constructor(cat: any) {
        this.id = cat.id;
        this.name = cat.name;
        this.meta_description = cat.meta_description;
        this.meta_name = cat.meta_name;
        this.slug = cat.slug;
        this.image = cat.image;
        this.description = cat.description;
        // this.parent_id = cat.parent_id;
        this.parent = cat.parent ? { id: cat.parent.id, name: cat.parent.name } : null;
        this.status = cat.status;
        this.created_at = cat.created_at ? formatDateTime(cat.created_at) : '';
        this.updated_at = cat.updated_at ? formatDateTime(cat.updated_at) : '';
    }
}
