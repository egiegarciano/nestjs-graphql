import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/lib/enums/role.enum';

export const Roles = (...roles: Role[]) => {
  return SetMetadata('roles', roles);
};
