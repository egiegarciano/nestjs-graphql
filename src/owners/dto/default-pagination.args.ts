import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

@ArgsType()
export class OptionsPaginationArgs {
  @Field(() => Int, { defaultValue: 10 })
  @IsPositive()
  limit: number;

  @Field(() => Int, { defaultValue: 1 })
  @IsPositive()
  page: number;
}
