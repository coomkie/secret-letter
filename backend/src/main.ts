import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // ⚡ Bật CORS cho React
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://www.lekhaiduong.site',
            'http://lekhaiduong.site',
        ],
        credentials: true,
        methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
    });

    // Global validation
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // Swagger config
    const config = new DocumentBuilder()
        .setTitle('Secret letter API')
        .setDescription('Secret letter API ')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header'
            },
            'jwt'
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
