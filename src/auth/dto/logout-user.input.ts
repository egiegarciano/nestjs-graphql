import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LogoutInput {
  @Field()
  email: string;
}

@ObjectType()
export class LogoutOutput {
  @Field()
  message: string;
}
