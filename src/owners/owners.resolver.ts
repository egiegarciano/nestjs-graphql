import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { OwnersService } from './owners.service';
import { Owner } from '../entities/owner.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/lib/enums/role.enum';
import { DefaultPaginationArgs } from './dto/default-pagination.args';
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
    return this.ownersService.findOneOWner(username);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Query(() => Owner, { name: 'me' })
  getMe(@Context() context: any) {
    return this.ownersService.findOwnerAccessToken(context.req.user.id);
  }

  @Query(() => OwnerPaginateOutput)
  ownerPaginate(@Args() pagination: DefaultPaginationArgs) {
    return this.ownersService.paginate(pagination);
  }

  // not working yet
  @Mutation(() => String)
  removeOwner(@Args('id', { type: () => Int }) id: number) {
    return this.ownersService.remove(id);
  }
}
