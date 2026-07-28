import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/cms/users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { FrontendLayoutModule } from './modules/frontend/layout/layout.module';
import { SendMailModule } from './modules/mailer/mailer.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import typeorm from './config/typeorm';
import { CategoriesModule } from './modules/cms/categories/categories.module';
import { BlogsModule } from './modules/cms/blogs/blogs.module';
import { ProductsModule } from './modules/cms/products/products.module';
import { ReviewsModule } from './modules/cms/reviews/reviews.module';
import { OrdersModule } from './modules/cms/orders/orders.module';
import { FrontendProductsModule } from './modules/frontend/products/products.module';
import { FrontendBlogsModule } from './modules/frontend/blogs/blogs.module';
import { BannersModule } from './modules/cms/banners/banners.module';
import { GeneralModule } from './modules/cms/general/general.module';
import { FrontendOrdersModule } from './modules/frontend/order/order.module';
import { FrontendReviewModule } from './modules/frontend/review/review.module';
import { FrontendSearchModule } from './modules/frontend/search/search.module';
import { VnpayModule } from './modules/vnpay/vnpay.module';
import { TransactionModule } from './modules/cms/transaction/transaction.module';
import { FrontendPaymentModule } from './modules/frontend/payment/payment.module';
import { ProductionBatchesModule } from './modules/cms/production-batches/production-batches.module';
import { FrontendCategoriesModule } from './modules/frontend/categories/categories.module';
import { ApiKeysModule } from './modules/cms/api-keys/api-keys.module';
import { FrontendChatModule } from './modules/frontend/chat/chat.module';
@Module({
    imports: [
        //CMS
        UsersModule,
        AuthModule,
        CategoriesModule,
        BlogsModule,
        ProductsModule,
        ReviewsModule,
        OrdersModule,
        BannersModule,
        GeneralModule,
        TransactionModule,
        ProductionBatchesModule,
        ApiKeysModule,
        //Frontend
        FrontendLayoutModule,
        FrontendCategoriesModule,
        FrontendProductsModule,
        FrontendBlogsModule,
        FrontendOrdersModule,
        FrontendReviewModule,
        FrontendSearchModule,
        FrontendPaymentModule,
        FrontendChatModule,
        VnpayModule,

        //MailerModule
        SendMailModule,

        //UploadModule
        UploadModule,

        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeorm],
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => configService.get('typeorm'),
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: { expiresIn },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        JwtService,
        Reflector,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {
    constructor() {}
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
