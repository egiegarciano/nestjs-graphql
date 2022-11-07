import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationError } from 'apollo-server-express';
import { ConfigService } from '@nestjs/config';

import { OwnersService } from 'src/owners/owners.service';
import { TokenPayload } from 'src/lib/types/tokenPayload';
import { Role } from 'src/lib/enums/role.enum';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly ownerService: OwnersService,
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${configService.get('JWT_SECRET')}`, // process.env.JWT_TOKEN
    });
    // super({
    //   jwtFromRequest: ExtractJwt.fromExtractors([
    //     (request: any) => {
    //       return request?.cookies?.accessToken;
    //     },
    //   ]),s
    //   secretOrKey: 'hide-me',
    // });
  }

  async validate(payload: TokenPayload) {
    // payload is coming from jwt.sign when login
    // payload = decoded JWT
    // this will be available in the context

    if (payload.role === Role.USER) {
      const user = await this.ownerService.findOneOWner(payload.email);
      if (!user || user.access_token === '')
        throw new AuthenticationError('User is not logged in');

      return user;
    }

    if (payload.role === Role.ADMIN) {
      const admin = await this.adminService.findOneAdmin(payload.email);
      if (!admin || admin.access_token === '')
        throw new AuthenticationError('User is not logged in');

      return admin;
    }

    // try {
    // } catch (error) {
    //   throw new AuthenticationError('User is not logged in');
    // }
  }
}
