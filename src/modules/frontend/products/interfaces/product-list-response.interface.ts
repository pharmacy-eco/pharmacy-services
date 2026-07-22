export interface IProductCategorySummary {
    id: number;
    name: string;
    slug: string;
}

export interface IProductListItem {
    id: number;
    name: string;
    meta_name: string;
    slug: string;
    unit: string;
    optionals: Record<string, string | number | boolean>;
    price: number;
    current_price: number;
    thumbnail: string;
    categories: IProductCategorySummary[];
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
