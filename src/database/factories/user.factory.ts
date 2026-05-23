import { Users } from '../../entity/users.entity';

export function userFactory(): Users[] {
    const users: Users[] = [];

    const userAdmin = new Users();
    userAdmin.avatar = 'avartar';
    userAdmin.phone = '0377917901';
    userAdmin.email = 'admin@gmail.com';
    userAdmin.password = '$2a$10$OoT/VPeSwQcQKWv/mrQzVePs8Z99B373MBPvgP1YPoQozYkjDtBua';
    userAdmin.created_by = 1;
    userAdmin.updated_by = 1;
    userAdmin.role_id = 1;
    userAdmin.status = 1;
    userAdmin.username = 'anhdadenbenem';
    userAdmin.gender = 1;
    userAdmin.fullname = 'Admin';
    users.push(userAdmin);

    return users;
}
