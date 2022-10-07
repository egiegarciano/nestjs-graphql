import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // There's also strategy for Google auth, etc,.
  constructor(private readonly authService: AuthService) {
    super(); // automatically calling the Strategy itself
  }

  // need to have validate method
  async validate(username: string, password: string) {
    // when we return the user it's become part of the context
    // try {
    return await this.authService.validateUser(username, password);
    // } catch (error) {
    //   console.log(error, 'in local.strategy.ts');
    //   throw new UnauthorizedException();
    // }
  }
}
