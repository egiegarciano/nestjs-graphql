import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { ConfirmationResponse } from './dto/email-response';
import { ConfirmationInputForClient } from './dto/mailer.input';
import { MailerService } from './mailer.service';

@Resolver()
export class MailerResolver {
  constructor(private readonly mailerService: MailerService) {}

  // @Mutation(() => ConfirmationResponse)
  // sendEmail(@Args('input') input: ConfirmationInputForClient) {
  //   return this.mailerService.confirmation(input);
  // }
}
