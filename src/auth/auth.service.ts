import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { OwnersService } from 'src/owners/owners.service';
import { OwnerResponse } from './dto/owner-response';
import { CreateOwnerInput } from 'src/owners/dto/create-owner.input';

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

    if (!user) throw new Error('No user found');

    const valid = await bcrypt.compare(password, user.password);

    if (user && valid) {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(owner: OwnerResponse) {
    // const { password, ...result } = user;

    return {
      access_token: this.jwtService.sign({
        username: owner.username,
        sub: owner.id,
      }),
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

    const password = await bcrypt.hash(signupUserInput.password, 10);

    return this.ownersService.createOwner({ password, ...signupUserInput });
  }
}
