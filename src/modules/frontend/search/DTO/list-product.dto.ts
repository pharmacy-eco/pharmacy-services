import { Products } from '../../../../entity/products.entity';
import { formatDate, formatDateTime } from '../../../../utils/datetime.util';

export class ListProductDto {
    id: number;
    name: string;
    meta_name: string;
    meta_description: string;
    slug: string;
    thumbnail: string;
    images: Array<{
        id: number;
        url: string;
        is_thumbnail: number;
    }>;
    price: number;
    current_price: number;
    curent_price: number;
    is_hot: number;
    status: number;
    unit: string;
    description: string;
    content: string;
    optionals: Record<string, string | number | boolean>;
    category: Array<string>;
    category_ids: Array<number>;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    production_batch_id: number;
    production_batch: {
        id: number;
        name: string;
        manufacturing_date: string;
        expiration_date: string;
        quantity: number;
        production_place: string;
        status: number;
    };
    created_at: string;
    updated_at: string;

    constructor(pro: Products) {
        this.id = pro.id;
        this.name = pro.name;
        this.meta_name = pro.meta_name;
        this.meta_description = pro.meta_description;
        this.slug = pro.slug;
        this.unit = pro.unit;
        this.price = pro.price;
        this.current_price = pro.current_price;
        this.curent_price = pro.current_price;
        this.is_hot = pro.is_hot;
        this.description = pro.description;
        this.content = pro.content;
        this.optionals = pro.optionals || {};
        this.images = (pro.productImage || []).map((img) => ({
            id: img.id,
            url: img.url,
            is_thumbnail: img.is_thumbnail,
        }));
        this.thumbnail = this.images.find((img) => Number(img.is_thumbnail) === 1)?.url ?? this.images[0]?.url ?? '';
        this.category = (pro.category || []).map((cate) => cate.name);
        this.category_ids = (pro.category || []).map((cate) => cate.id);
        this.categories = (pro.category || []).map((cate) => ({
            id: cate.id,
            name: cate.name,
            slug: cate.slug,
        }));
        this.production_batch_id = pro.production_batch_id;
        this.production_batch = pro.productionBatch
            ? {
                  id: pro.productionBatch.id,
                  name: pro.productionBatch.name,
                  manufacturing_date: pro.productionBatch.manufacturing_date
                      ? formatDate(pro.productionBatch.manufacturing_date)
                      : '',
                  expiration_date: pro.productionBatch.expiration_date ? formatDate(pro.productionBatch.expiration_date) : '',
                  quantity: pro.productionBatch.quantity,
                  production_place: pro.productionBatch.production_place,
                  status: pro.productionBatch.status,
              }
            : null;
        this.status = pro.status;
        this.created_at = pro.created_at ? formatDateTime(pro.created_at) : '';
        this.updated_at = pro.updated_at ? formatDateTime(pro.updated_at) : '';
    }
}
