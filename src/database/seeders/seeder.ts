// src/seeder.ts

import { seedUsers } from './user.seeder';
import DataSource from '../../../ormconfig';
import { seedGenaral } from './general.seeder';
import { seedReview } from './review.seeder';

async function seed() {
    await DataSource.initialize();
    console.log('Database connected');

    // await seedUsers(DataSource);

    // await seedGenaral(DataSource);

    await seedReview(DataSource);

    await DataSource.destroy();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
