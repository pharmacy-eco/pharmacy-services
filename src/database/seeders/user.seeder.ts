import { Users } from '../../entity/users.entity';
import { DataSource } from 'typeorm';
import { userFactory } from '../factories/user.factory';

export async function seedUsers(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(Users);

    const users = userFactory();
    await userRepository.save(users);

    console.log('Seed users thành công!');
}
