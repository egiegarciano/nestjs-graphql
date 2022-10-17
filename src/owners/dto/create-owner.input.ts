import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { CustomEmailScalar } from 'src/lib/custom-scalar-type/GraphQLEmail';

@InputType()
export class CreateOwnerInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;
}
