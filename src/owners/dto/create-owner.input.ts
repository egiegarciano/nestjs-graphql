import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateOwnerInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;
}
