import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { Owner } from 'src/entities/owner.entity';
import { CreateOwnerInput } from 'src/owners/dto/create-owner.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LogoutInput, LogoutOutput } from './dto/logout-user.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => Owner)
  signup(@Args('signupUserInput') signupUserInput: CreateOwnerInput) {
    return this.authService.signup(signupUserInput);
  }

  @Mutation(() => LogoutOutput)
  logout(@Args('logoutInput') logoutInput: LogoutInput) {
    return this.authService.logout(logoutInput);
  }
}
