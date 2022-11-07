import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule as MailModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { MailerService } from './mailer.service';
import { MailerResolver } from './mailer.resolver';

@Module({
  imports: [
    MailModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAILER_HOST'),
          port: config.get('MAILER_PORT'),
          auth: {
            user: config.get('MAILER_USER'),
            pass: config.get('MAILER_PASSWORD'),
          },
          secure: false,
          logger: true,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerResolver, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
