import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOwnerInput {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
