import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConfirmationResponse {
  @Field()
  message: string;

  @Field()
  statusCode: number;
}
