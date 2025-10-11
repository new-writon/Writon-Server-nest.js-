import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import type { ConfigObject } from './global/config/configuration';
import { HttpExceptionFilter } from './global/exception/HttpExceptionFilter';
import { SwaggerModule } from '@nestjs/swagger';
import { BaseAPIDocument } from './swagger.documment';
import { MetricsInterceptor } from './global/monitor/MetricsInterceptor';
import { initializeTransactionalContext } from 'typeorm-transactional';
import cookieParser from 'cookie-parser';

// import * as crypto from 'crypto';
// (globalThis as any).crypto = crypto;
async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://grafana.writon.co.kr',
      'https://api.writon.co.kr',
      'https://www.writon.co.kr',
      'http://localhost:5173',
    ],
    //origin: '*',
    credentials: true,
    exposedHeaders: ['Authorization'], // * 사용할 헤더 추가.
  });
  app.useGlobalInterceptors(app.get(MetricsInterceptor));
  const config = app.get<ConfigService<ConfigObject, true>>(ConfigService);
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(config.get('validation')));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const swaggerConfig = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(config.get('port'));
}
void bootstrap();
