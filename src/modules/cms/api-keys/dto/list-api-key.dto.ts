import { ApiKeys } from '../../../../entity/api_keys.entity';
import { formatDate, formatDateTime } from '../../../../utils/datetime.util';

function maskApiKey(apiKey: string): string {
    if (!apiKey) return '';
    if (apiKey.length <= 8) return '********';

    return `${apiKey.slice(0, 4)}********${apiKey.slice(-4)}`;
}

export class ApiKeyListDto {
    id: number;
    name: string;
    api_key_masked: string;
    model: string;
    expires_at: string;
    token_quota: number;
    token_used: number;
    token_remaining: number;
    status: number;
    created_at: string;
    updated_at: string;

    constructor(apiKey: ApiKeys) {
        this.id = apiKey.id;
        this.name = apiKey.name;
        this.api_key_masked = maskApiKey(apiKey.api_key);
        this.model = apiKey.model;
        this.expires_at = apiKey.expires_at ? formatDate(apiKey.expires_at) : '';
        this.token_quota = apiKey.token_quota || 0;
        this.token_used = apiKey.token_used || 0;
        this.token_remaining = this.token_quota > 0 ? Math.max(this.token_quota - this.token_used, 0) : 0;
        this.status = apiKey.status;
        this.created_at = apiKey.created_at ? formatDateTime(apiKey.created_at) : '';
        this.updated_at = apiKey.updated_at ? formatDateTime(apiKey.updated_at) : '';
    }
}
