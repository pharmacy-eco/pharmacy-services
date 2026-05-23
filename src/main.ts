import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
// import serveStatic from 'serve-static';
// import { join } from 'path';

export async function createNestApplication() {
    const app = await NestFactory.create(AppModule);

    // app.use('/uploads', serveStatic(join(__dirname, '..', 'uploads')));
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.enableCors({ origin: '*' });
    const config = new DocumentBuilder().setTitle('Nhathuoclongchau API').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    return app;
}

if (process.env.NODE_ENV !== 'production') {
    createNestApplication().then((app) => {
        app.listen(process.env.PORT, () => console.log(`Server started on http://localhost:${process.env.PORT}`));
    });
}
