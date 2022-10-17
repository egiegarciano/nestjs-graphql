import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';

import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Admin } from 'src/entities/admin.entity';
import { Role } from 'src/lib/enums/role.enum';
import { AdminService } from './admin.service';
import { CreateAdminInput } from './dto/create-admin.input';
import { UpdateAdminInput } from './dto/update-admin.input';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  // @Mutation('createAdmin')
  // create(@Args('createAdminInput') createAdminInput: CreateAdminInput) {
  //   return this.adminService.create(createAdminInput);
  // }

  @Query(() => Admin)
  getOneAdmin(@Args('email') email: string) {
    return this.adminService.findOneAdmin(email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => Admin, { name: 'currentAdmin' })
  getMe(@Context() context: any) {
    return this.adminService.findOwnerAccessToken(context.req.user.id);
  }

  // @Mutation('updateAdmin')
  // update(@Args('updateAdminInput') updateAdminInput: UpdateAdminInput) {
  //   return this.adminService.update(updateAdminInput.id, updateAdminInput);
  // }

  // @Mutation('removeAdmin')
  // remove(@Args('id') id: number) {
  //   return this.adminService.remove(id);
  // }
}
