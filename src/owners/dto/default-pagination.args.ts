import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
export class EmailPaginationArg {
  @Field({ nullable: true })
  email?: string;
}
