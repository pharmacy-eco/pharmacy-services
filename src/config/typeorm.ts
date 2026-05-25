import { Roles } from '../entity/roles.entity';
import { Users } from '../entity/users.entity';
import { Permissions } from '../entity/permissions.entity';
import { registerAs } from '@nestjs/config';
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

const config = {
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
