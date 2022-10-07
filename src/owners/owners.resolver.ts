import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { OwnersService } from './owners.service';
import { Owner } from '../entities/owner.entity';
import { CreateOwnerInput } from './dto/create-owner.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => Owner)
export class OwnersResolver {
  constructor(private readonly ownersService: OwnersService) {}

  @Mutation(() => Owner)
  createOwner(
    @Args('createOwnerInput') createOwnerInput: CreateOwnerInput,
  ): Promise<Owner> {
    return this.ownersService.createOwner(createOwnerInput);
  }

  @Query(() => [Owner], { name: 'owners' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ownersService.findAll();
  }

  @Query(() => Owner, { name: 'getOwner' })
  findOne(@Args('username') username: string) {
    return this.ownersService.findOneOWner(username);
  }

  @Query(() => Owner, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  getMe(@Context() context: any) {
    return this.ownersService.findOwnerAccessToken(context.req.user.id);
  }

  // not working yet
  // @Mutation(() => Owner)
  // updateOwner(@Args('updateOwnerInput') updateOwnerInput: UpdateOwnerInput) {
  //   return this.ownersService.update(updateOwnerInput.id, updateOwnerInput);
  // }

  @Mutation(() => Owner)
  removeOwner(@Args('id', { type: () => Int }) id: number) {
    return this.ownersService.remove(id);
  }
}
