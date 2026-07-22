export interface IFeaturedCategory {
    id: number;
    name: string;
    slug: string;
    image: string;
    meta_name: string;
    product_count: number;
}

export interface IFeaturedCategoriesApiResponse {
    requestId: string;
    at: string;
    error: {
        code: number;
        message: string;
    };
    data?: IFeaturedCategory[];
}
