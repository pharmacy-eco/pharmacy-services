import { Roles } from '../entity/roles.entity';
import { Users } from '../entity/users.entity';
import { Permissions } from '../entity/permissions.entity';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RoleHasPermissions } from '../entity/role_has_permission.entity';
import { General } from '../entity/general.entity';
import { SettingMails } from '../entity/setting_mails.entity';
import { ContentMails } from '../entity/content_mails.entity';
import { Products } from '../entity/products.entity';
import { Categories } from '../entity/categories.entity';
import { Reviews } from '../entity/reviews.entity';
import { ProductsImage } from '../entity/products_image.entity';
import { Blogs } from '../entity/blogs.entity';
import { Banners } from '../entity/banners.entity';
import { Orders } from '../entity/orders.entity';

dotenvConfig({ path: '.env' });

const config = {
    type: 'mysql',
    host: `${process.env.MYSQL_HOST}`,
    port: `${process.env.MYSQL_PORT}`,
    username: `${process.env.MYSQL_USER}`,
    password: `${process.env.MYSQL_PASSWORD}`,
    database: `${process.env.MYSQL_DB}`,
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
        Reviews,
        Banners,
        Orders,
    ],
    migrations: [__dirname + '/**/database/migrations/*.ts'],
    autoLoadEntities: true,
    synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
