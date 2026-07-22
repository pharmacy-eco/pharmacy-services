import { formatDateTime } from '../../../../utils/datetime.util';
import { Products } from '../../../../entity/products.entity';

export class ProductsListDto {
    id: number;
    name: string;
    slug: string;
    image: Array<string>;
    status: number;
    unit: string;
    price: number;
    current_price: number;
    production_batch: {
        id: number;
        name: string;
    };
    category: Array<string>;
    created_at: string;
    updated_at: string;

    constructor(pro: Products) {
        this.id = pro.id;
        this.name = pro.name;
        this.slug = pro.slug;
        this.unit = pro.unit;
        this.price = pro.price;
        this.current_price = pro.current_price;
        this.image = [pro.productImage.filter((img) => img.is_thumbnail == 1)[0].url];
        this.category = pro.category.map((cate) => cate.name);
        this.production_batch = pro.productionBatch
            ? { id: pro.productionBatch.id, name: pro.productionBatch.name }
            : null;
        this.status = pro.status;
        this.created_at = pro.created_at ? formatDateTime(pro.created_at) : '';
        this.updated_at = pro.updated_at ? formatDateTime(pro.updated_at) : '';
    }
}
