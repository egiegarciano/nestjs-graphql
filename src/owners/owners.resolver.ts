import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { OwnersService } from './owners.service';
import { Owner } from '../entities/owner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../lib/enums/role.enum';
import { OptionsPaginationArgs } from './dto/default-pagination.args';
import { OwnerPaginateOutput } from './dto/owner-paginate.output';

@Resolver(() => Owner)
export class OwnersResolver {
  constructor(private readonly ownersService: OwnersService) {}

  @Query(() => [Owner], { name: 'owners' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ownersService.findAll();
  }

  @Query(() => Owner, { name: 'getOwner' })
  findOne(@Args('username') username: string) {
    return this.ownersService.findOneOwner(username);
  }

  // e butang nalang ni sa auth resolvers
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Query(() => Owner, { name: 'me' })
  getMe(@Context() context: any) {
    return this.ownersService.findOwnerAccessToken(context.req.user.id);
  }

  @Query(() => OwnerPaginateOutput)
  ownerPaginate(
    @Args() pagination: OptionsPaginationArgs,
    @Args('email', { nullable: true }) email?: string,
  ) {
    return this.ownersService.paginate(pagination, email);
  }

  // not working yet
  @Mutation(() => String)
  removeOwner(@Args('id', { type: () => Int }) id: number) {
    return this.ownersService.remove(id);
  }
}
