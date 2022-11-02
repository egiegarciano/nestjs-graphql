import {
  BadRequestException,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: false },
      // stopAtFirstError: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );

  app.use(graphqlUploadExpress({ maxFileSize: 100000000 }));

  app.useStaticAssets(join(process.cwd(), '/src/upload'));

  await app.listen(11000);
}

bootstrap();
