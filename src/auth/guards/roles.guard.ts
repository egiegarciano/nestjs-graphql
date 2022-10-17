import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from 'src/lib/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    // What is the required role?
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      // trying to pull in the metadata of that specific context
      context.getHandler(),
      context.getClass(),
    ]);

    // kung wala gali decorator na @Roles(Roles.USER) ug dapat global pag set and RolesGuard
    // if (!requiredRoles) {
    //   return true;
    // }

    const { user } = await ctx.getContext().req;
    return requiredRoles.some((role) => user.role?.includes(role));
    // does the current user making the request have those required roles
    // if its true user have access otherwise false
  }
}
