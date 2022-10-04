import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LogoutInput {
  @Field()
  username: string;
}

@ObjectType()
export class LogoutOutput {
  @Field()
  message: string;
}
