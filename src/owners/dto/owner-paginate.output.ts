import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Owner } from 'src/entities/owner.entity';

@ObjectType()
class MetaInfo {
  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;
}

@ObjectType()
export class OwnerPaginateOutput {
  @Field(() => [Owner])
  items: Owner[];

  @Field(() => MetaInfo)
  meta: MetaInfo;
}
