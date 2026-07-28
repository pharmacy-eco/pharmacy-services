import { formatDate, formatDateTime } from '../../../../utils/datetime.util';
import { Products } from '../../../../entity/products.entity';

export class ProductsListDto {
    id: number;
    name: string;
    slug: string;
    image: Array<string>;
    images: Array<{
        id: number;
        url: string;
        is_thumbnail: number;
    }>;
    status: number;
    unit: string;
    price: number;
    current_price: number;
    is_hot: number;
    description: string;
    content: string;
    meta_name: string;
    meta_description: string;
    optionals: Record<string, string | number | boolean>;
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
    category: Array<string>;
    category_ids: Array<number>;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    created_at: string;
    updated_at: string;

    constructor(pro: Products) {
        this.id = pro.id;
        this.name = pro.name;
        this.slug = pro.slug;
        this.unit = pro.unit;
        this.price = pro.price;
        this.current_price = pro.current_price;
        this.is_hot = pro.is_hot;
        this.description = pro.description;
        this.content = pro.content;
        this.meta_name = pro.meta_name;
        this.meta_description = pro.meta_description;
        this.optionals = pro.optionals;
        this.production_batch_id = pro.production_batch_id;
        this.images = (pro.productImage || []).map((img) => ({
            id: img.id,
            url: img.url,
            is_thumbnail: img.is_thumbnail,
        }));
        this.image = this.images.filter((img) => img.is_thumbnail == 1).map((img) => img.url);
        this.category = (pro.category || []).map((cate) => cate.name);
        this.category_ids = (pro.category || []).map((cate) => cate.id);
        this.categories = (pro.category || []).map((cate) => ({
            id: cate.id,
            name: cate.name,
            slug: cate.slug,
        }));
        this.production_batch = pro.productionBatch
            ? {
                  id: pro.productionBatch.id,
                  name: pro.productionBatch.name,
                  manufacturing_date: pro.productionBatch.manufacturing_date
                      ? formatDate(pro.productionBatch.manufacturing_date)
                      : '',
                  expiration_date: pro.productionBatch.expiration_date
                      ? formatDate(pro.productionBatch.expiration_date)
                      : '',
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
