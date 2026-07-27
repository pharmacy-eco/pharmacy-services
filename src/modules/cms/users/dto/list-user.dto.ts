import { Users } from '../../../../entity/users.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

export class UserListDto {
    id: number;
    fullname: string;
    username: string;
    email: string;
    address: string;
    status: number;
    avatar: string;
    role_id: number;
    role_name: string;
    created_at: string;
    updated_at: string;

    constructor(user: Users & { role_name: string }) {
        this.id = user.id;
        this.fullname = user.fullname;
        this.username = user.username;
        this.email = user.email;
        this.address = user.address;
        this.status = user.status;
        this.avatar = user.avatar;
        this.role_id = user.role_id;
        this.role_name = user.role_name;
        this.created_at = user.created_at ? formatDateTime(user.created_at) : '';
        this.updated_at = user.updated_at ? formatDateTime(user.updated_at) : '';
    }
}
