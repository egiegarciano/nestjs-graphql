import { HttpStatus, Injectable } from '@nestjs/common';
import { MailerService as MailService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async confirmation(email: string, token: string) {
    const confirmUrl = `${this.configService.get(
      'MAILER_URL_CLIENT_CONFIRMATION',
    )}/signup/${token}`;

    await this.mailService.sendMail({
      to: email,
      from: {
        name: 'customerSender',
        address: this.configService.get('MAILER_FROM_EMAIL'),
      },
      subject: 'Email confirmation',
      template: './confirmation/confirmation',
      context: {
        confirmUrl,
      },
    });

    return {
      message: 'Please check your email for confirmation.',
      statusCode: HttpStatus.OK,
    };
  }
}
