import { Role } from '../enums/role.enum';

export type TokenPayload = {
  sub: number;
  email: string;
  role: Role;
};
