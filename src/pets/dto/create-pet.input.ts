import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePetInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  ownerId?: number;
}
