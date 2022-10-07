import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { OwnersService } from 'src/owners/owners.service';
import { OwnerResponse } from './dto/owner-response';
import { CreateOwnerInput } from 'src/owners/dto/create-owner.input';
import { LogoutInput } from './dto/logout-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly ownersService: OwnersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<OwnerResponse> {
    const user = await this.ownersService.findOneOWner(username);

    const sampleErrors: { property: string; message: string }[] = [];

    if (!user) {
      sampleErrors.push({ property: 'username', message: 'No user found' });
      throw new UnauthorizedException({ sampleErrors }, 'No user found');
    }

    const passwordIsInvalid = await bcrypt.compare(password, user.password);

    if (!passwordIsInvalid) {
      // try to use the UserInputError from apollo server
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (user && passwordIsInvalid) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(owner: OwnerResponse) {
    const access_token = this.jwtService.sign({
      username: owner.username,
      sub: owner.id,
    });

    await this.ownersService.updateCredential({
      id: owner.id,
      name: owner.name,
      username: owner.username,
      access_token: access_token,
    });

    return {
      access_token: access_token,
      owner,
    };
  }

  async signup(signupUserInput: CreateOwnerInput) {
    const user = await this.ownersService.findOneOWner(
      signupUserInput.username,
    );

    if (user) {
      throw new Error('User already exists!');
    }

    const { password: ownerPassword, ...rest } = signupUserInput;

    const password = await bcrypt.hash(ownerPassword, 10);

    return this.ownersService.createOwner({ password, ...rest });
  }

  async logout(logoutInput: LogoutInput) {
    const user = await this.ownersService.findOneOWner(logoutInput.username);

    await this.ownersService.updateCredential({
      id: user.id,
      name: user.name,
      username: user.username,
      access_token: '',
    });

    return {
      message: 'Successfully logout',
    };
  }
}
