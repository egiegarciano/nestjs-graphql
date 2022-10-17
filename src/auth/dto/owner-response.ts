import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pet } from 'src/entities/pet.entity';
import { Role } from 'src/lib/enums/role.enum';

@ObjectType()
export class OwnerResponse {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  access_token: string;

  @Field(() => Role)
  role?: Role;

  @Field(() => [Pet])
  pets?: Pet[];
}
