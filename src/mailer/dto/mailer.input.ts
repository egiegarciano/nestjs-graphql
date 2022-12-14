import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ConfirmationInputForClient {
  @Field(() => String)
  to: string;
}
