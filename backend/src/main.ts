import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
    const isProduction = process.env.NODE_ENV === 'production';

    let app: INestApplication<any>;

    // disable default Nest.js bootstrap logs in production since they will spam
    // into AWS CloudWatch logs
    if (isProduction) {
        app = await NestFactory.create(AppModule, { logger: false });
    } else {
        app = await NestFactory.create(AppModule);
    }

    // even though lambda and API gateway have some protections,
    // helmet is responsible for much more of them, like CSP, XSS, etc.
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    // used so Swagger can work in Production
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                    styleSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                    imgSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
                    fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
                },
            },
        }),
    );
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');

    // used for increasing limit of objects
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    addSwagger(app, isProduction);

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};

function addSwagger(app: INestApplication<any>, isProduction: boolean) {
    const config = new DocumentBuilder()
        .setTitle('React and Serverless Nest template')
        .setDescription(
            'Api for React and Serverless Nest template, still in development',
        )
        .setVersion('0.0.1')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    // for the unknown reason Swagger doesn't load static files while being deployed in AWS,
    // so this is a workaround on how to load them in production
    if (isProduction) {
        const swaggerCDN =
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2';
        SwaggerModule.setup('docs', app, documentFactory, {
            customCssUrl: [`${swaggerCDN}/swagger-ui.css`],
            customJs: [
                `${swaggerCDN}/swagger-ui-bundle.js`,
                `${swaggerCDN}/swagger-ui-standalone-preset.js`,
            ],
        });
    } else {
        SwaggerModule.setup('docs', app, documentFactory);
    }
}
