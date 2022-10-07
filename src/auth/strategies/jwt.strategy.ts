import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { OwnersService } from 'src/owners/owners.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly ownersService: OwnersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hide-me', // process.env.JWT_SECRET
    });
    // super({
    //   jwtFromRequest: ExtractJwt.fromExtractors([
    //     (request: any) => {
    //       return request?.cookies?.accessToken;
    //     },
    //   ]),
    //   secretOrKey: 'hide-me',
    // });
  }

  async validate(payload: any) {
    // payload is coming from jwt.sign when login
    // payload = decoded JWT
    // this will be available in the context
    return { id: payload.sub, username: payload.username };

    // try {
    //   return await this.ownersService.findOneOWner(payload.username);
    // } catch (error) {
    //   throw new UnauthorizedException('User is not logged in');
    // }
  }
}
