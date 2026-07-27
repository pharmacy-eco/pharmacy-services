import { Products } from '../../../../entity/products.entity';

export class ListProductDto {
    id: number;
    name: string;
    meta_name: string;
    slug: string;
    thumbnail: string;
    price: number;
    curent_price: number;
    status: number;
    unit: string;
    category: Array<string>;
    created_at: string;
    updated_at: string;

    constructor(pro: Products) {
        this.id = pro.id;
        this.name = pro.name;
        this.meta_name = pro.meta_name;
        this.slug = pro.slug;
        this.unit = pro.unit;
        this.price = pro.price;
        this.curent_price = pro.current_price;
        this.thumbnail =
            pro.productImage && pro.productImage.length > 0
                ? pro.productImage.filter((img) => img.is_thumbnail == 1)[0].url
                : '';
        this.status = pro.status;
    }
}
