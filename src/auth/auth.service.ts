import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-express';

import { OwnersService } from 'src/owners/owners.service';
import { CreateOwnerInput } from 'src/owners/dto/create-owner.input';
import { LogoutInput } from './dto/logout-user.input';
import { TokenPayload } from 'src/lib/types/tokenPayload';
import { Owner } from 'src/entities/owner.entity';
import { AdminService } from 'src/admin/admin.service';
import { MailerService } from 'src/mailer/mailer.service';
import { Role } from 'src/lib/enums/role.enum';
import { Admin } from 'src/entities/admin.entity';
import { LoginAdminInput } from './dto/login-admin.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ownerService: OwnersService,
    private readonly adminService: AdminService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<Owner> {
    const user = await this.ownerService.findOneOWner(email);

    const sampleErrors: { property: string; message: string }[] = [];

    if (!user) {
      sampleErrors.push({ property: 'username', message: 'No user found' });
      // throw new UnauthorizedException({ sampleErrors }, 'No user found');
      throw new AuthenticationError('Authentication Error', { sampleErrors });
    }

    const passwordIsInvalid = await bcrypt.compare(password, user.password);

    // if ever gali e combine e butang nalaang and pag throw ug error sa local strategy sa validate
    if (!passwordIsInvalid) {
      throw new AuthenticationError('Credentials are invalid');
    }

    // Add check here if user is confirmed
    if (!user.confirmed) {
      throw new AuthenticationError('Email not yet confirm');
    }

    if (user && passwordIsInvalid) {
      return user;
    }

    return null;
  }

  async login(owner: Owner) {
    const tokenPayload: TokenPayload = {
      sub: owner.id,
      email: owner.email,
      role: owner.role,
    };

    const access_token = this.jwtService.sign(tokenPayload);

    const user = await this.ownerService.findOneOWner(owner.email);

    user.access_token = access_token;

    await this.ownerService.updateCredential(user);

    return {
      access_token: access_token,
      owner,
    };
  }

  async signup(signupUserInput: CreateOwnerInput) {
    const user = await this.ownerService.findOneOWner(signupUserInput.email);

    if (user) {
      // shoudl throw specific user bad input error
      throw new Error('User already exists!'); // haven't try to parse this in frontend
    }

    const { password: passwordInput, ...rest } = signupUserInput;

    const password = await bcrypt.hash(passwordInput, 10);

    const createOwner = await this.ownerService.createOwner({
      password,
      ...rest,
    });

    const token = this.jwtService.sign({ email: signupUserInput.email });

    await this.mailerService.confirmation(signupUserInput.email, token);

    return createOwner;
  }

  async logout({ email }: LogoutInput) {
    const user = await this.ownerService.findOneOWner(email);

    user.access_token = '';

    await this.ownerService.updateCredential(user);

    return {
      message: 'Successfully logout',
    };
  }

  async adminLogin(loginAdminInput: LoginAdminInput) {
    const admin = await this.adminService.findOneAdmin(loginAdminInput.email);

    if (!admin) {
      throw new AuthenticationError('No Admin user found');
    }

    const passwordIsInvalid = await bcrypt.compare(
      loginAdminInput.password,
      admin.password,
    );

    if (!passwordIsInvalid) {
      throw new AuthenticationError('Credentials are invalid');
    }

    const tokenPayload: TokenPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const access_token = this.jwtService.sign(tokenPayload);

    admin.access_token = access_token;

    await this.adminService.updateCredential(admin);

    return admin;
  }

  async adminLogout({ email }: LogoutInput) {
    const admin = await this.adminService.findOneAdmin(email);

    if (admin.access_token === '') {
      return {
        message: 'Already logout.',
      };
    }

    admin.access_token = '';
    await this.adminService.updateCredential(admin);

    return {
      message: 'Successfully logout.',
    };
  }
}
