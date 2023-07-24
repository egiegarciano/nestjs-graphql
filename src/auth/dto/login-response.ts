import { Field, ObjectType } from '@nestjs/graphql';
import { Owner } from '../../entities/owner.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field(() => Owner)
  owner: Owner;
}
