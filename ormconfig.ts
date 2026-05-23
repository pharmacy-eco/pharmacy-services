import { config } from 'dotenv';
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
config();

export default new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT ?? ''),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
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
    ],
    migrations: [__dirname + '/**/*/database/migrations/*.ts'],
    synchronize: false, // Để false để tránh tự động tạo bảng khi không dùng migration tránh mất toàn bộ dữ liệu
    migrationsRun: true,
});
