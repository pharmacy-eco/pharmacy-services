import { Banners } from '../../../../entity/banners.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

export class BannersListDto {
    id: number;
    title: string;
    url: string;
    status: number;
    position: number;
    is_slider: number;
    created_at: string;
    updated_at: string;

    constructor(banner: Banners) {
        this.id = banner.id;
        this.title = banner.title;
        this.url = banner.url;
        this.position = banner.position;
        this.is_slider = banner.is_slider;
        this.status = banner.status;
        this.created_at = banner.created_at ? formatDateTime(banner.created_at) : '';
        this.updated_at = banner.updated_at ? formatDateTime(banner.updated_at) : '';
    }
}
