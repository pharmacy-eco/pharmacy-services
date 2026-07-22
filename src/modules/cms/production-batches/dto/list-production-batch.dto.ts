import { ProductionBatches } from '../../../../entity/production_batches.entity';
import { formatDate, formatDateTime } from '../../../../utils/datetime.util';

export class ProductionBatchListDto {
    id: number;
    name: string;
    manufacturing_date: string;
    expiration_date: string;
    quantity: number;
    production_place: string;
    status: number;
    created_at: string;
    updated_at: string;

    constructor(batch: ProductionBatches) {
        this.id = batch.id;
        this.name = batch.name;
        this.manufacturing_date = batch.manufacturing_date ? formatDate(batch.manufacturing_date) : '';
        this.expiration_date = batch.expiration_date ? formatDate(batch.expiration_date) : '';
        this.quantity = batch.quantity;
        this.production_place = batch.production_place;
        this.status = batch.status;
        this.created_at = batch.created_at ? formatDateTime(batch.created_at) : '';
        this.updated_at = batch.updated_at ? formatDateTime(batch.updated_at) : '';
    }
}
