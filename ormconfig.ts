import { DataSource } from 'typeorm';
import { Users } from './src/entity/users.entity';
import { Roles } from './src/entity/roles.entity';
import { Permissions } from './src/entity/permissions.entity';
import { RoleHasPermissions } from './src/entity/role_has_permission.entity';
import { General } from './src/entity/general.entity';
import { SettingMails } from './src/entity/setting_mails.entity';
import { ContentMails } from './src/entity/content_mails.entity';
import { Categories } from './src/entity/categories.entity';
import { Reviews } from './src/entity/reviews.entity';
import { ProductsImage } from './src/entity/products_image.entity';
import { Blogs } from './src/entity/blogs.entity';
import { Products } from './src/entity/products.entity';
import { Orders } from './src/entity/orders.entity';
import { OrderDetail } from './src/entity/order_detail.entity';
import { Transaction } from './src/entity/transaction.entity';
import { PaymentHistory } from './src/entity/payment_history.entity';
import { ProductionBatches } from './src/entity/production_batches.entity';

console.log(process.env, '123123');

export default new DataSource({
    type: 'mysql',
    host: `103.147.35.60`,
    port: 3306,
    username: `sow_wear`,
    password: `sow_wear@!123`,
    database: `sow_wear`,
    entities: [
        Users,
        Roles,
        Permissions,
        RoleHasPermissions,
        General,
        SettingMails,
        ContentMails,
        Products,
        Categories,
        Reviews,
        ProductsImage,
        Blogs,
        Orders,
        OrderDetail,
        Transaction,
        PaymentHistory,
        ProductionBatches,
    ],
    migrations: [__dirname + '/**/*/database/migrations/*.ts'],
    synchronize: false, // Để false để tránh tự động tạo bảng khi không dùng migration tránh mất toàn bộ dữ liệu
    migrationsRun: true,
});
