import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@ArgsType()
export class DefaultPaginationArgs {
  @Field(() => Int, { defaultValue: 10 })
  @IsPositive()
  limit: number;

  @Field(() => Int, { defaultValue: 1 })
  @IsPositive()
  page: number;
}
