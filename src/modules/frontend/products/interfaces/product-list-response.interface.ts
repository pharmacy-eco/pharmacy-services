export interface IProductCategorySummary {
    id: number;
    name: string;
    slug: string;
}

export interface IProductImageSummary {
    id: number;
    url: string;
    is_thumbnail: number;
}

export interface IProductProductionBatchSummary {
    id: number;
    name: string;
    manufacturing_date: string;
    expiration_date: string;
    quantity: number;
    production_place: string;
    status: number;
}

export interface IProductListItem {
    id: number;
    name: string;
    meta_name: string;
    meta_description: string;
    slug: string;
    unit: string;
    description: string;
    content: string;
    optionals: Record<string, string | number | boolean>;
    price: number;
    current_price: number;
    is_hot: number;
    status: number;
    thumbnail: string;
    productImage: IProductImageSummary[];
    category: string[];
    category_ids: number[];
    categories: IProductCategorySummary[];
    production_batch_id: number;
    production_batch: IProductProductionBatchSummary | null;
    created_at: string;
    updated_at: string;
}

export interface IProductsByCategoryResponse {
    category: IProductCategorySummary;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    items: IProductListItem[];
}

export interface IProductListApiResponse {
    requestId: string;
    at: string;
    error: {
        code: number;
        message: string;
    };
    data?: IProductsByCategoryResponse;
}
