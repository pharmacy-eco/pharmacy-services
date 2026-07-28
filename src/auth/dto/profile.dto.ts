import { Users } from '../../entity/users.entity';
import { formatDate } from '../../utils/datetime.util';

export class UserProfileDto {
    id: number;
    fullname: string;
    username: string;
    phone: string;
    email: string;
    address: string;
    birthday: string;
    avatar: string;

    constructor(user: Partial<Users>) {
        this.id = user.id;
        this.fullname = user.fullname;
        this.username = user.username;
        this.phone = user.phone;
        this.email = user.email;
        this.address = user.address;
        this.birthday = user.birthday
            ? typeof user.birthday === 'string'
                ? user.birthday
                : formatDate(user.birthday)
            : null;
        this.avatar = user.avatar;
    }
}
