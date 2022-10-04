import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pet } from 'src/entities/pet.entity';

@ObjectType()
export class OwnerResponse {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  access_token: string;

  @Field(() => [Pet])
  pets?: Pet[];
}
