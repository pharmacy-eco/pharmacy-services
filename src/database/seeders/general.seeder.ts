import { DataSource } from 'typeorm';
import { General } from '../../entity/general.entity';
import { generalFatory } from '../factories/general.factory';

export async function seedGenaral(dataSource: DataSource) {
    const generalRepository = dataSource.getRepository(General);

    const general = generalFatory();
    await generalRepository.save(general);

    console.log('Seed cấu hình chung thành công!');
}
