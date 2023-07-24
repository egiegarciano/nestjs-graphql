import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AdminService } from '../admin/admin.service';
import { MailerService } from '../mailer/mailer.service';
import { OwnersService } from '../owners/owners.service';
import { AuthService } from './auth.service';
import { Role } from '../lib/enums/role.enum';

describe('AuthService', () => {
  let authService: AuthService;

  const mockOwnersService = {
    findOneOwner: jest.fn(),
    updateOwner: jest.fn(),
    createOwner: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwtTokenHashString'),
  };

  const mockEmailService = {
    confirmation: jest
      .fn()
      .mockResolvedValue('Please check your email for confirmation.'),
  };

  const mockAdminService = {
    findOneAdmin: jest.fn(),
    updateCredential: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: OwnersService,
          useValue: mockOwnersService,
        },
        {
          provide: MailerService,
          useValue: mockEmailService,
        },
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    const owner = {
      id: 2,
      name: 'Garciano',
      email: 'garciano@test.com',
      password: 'password',
      confirmed: true,
    };
    it('should return the user if credentials is correct', async () => {
      mockOwnersService.findOneOwner.mockResolvedValue(owner);

      const spiedBcryptCompareMethod = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      // pwede sad ni pag mock sa bcrypt compare
      // const bcryptCompare = jest.fn().mockResolvedValue(true);
      // (bcrypt.compare as jest.Mock) = bcryptCompare;

      const validateUser = await authService.validateUser(
        'garciano@test.com',
        'password',
      );

      // expect(bcryptCompare).toHaveBeenCalled();
      expect(spiedBcryptCompareMethod).toHaveBeenCalled();
      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
      expect(validateUser).toEqual(owner);
    });

    it('should return an error if password is incorrect', async () => {
      mockOwnersService.findOneOwner.mockResolvedValue(owner);

      const spiedBcryptCompareMethod = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      try {
        await authService.validateUser('garciano@test.com', 'password');
      } catch (e) {
        expect(e.message).toMatch('Credentials are invalid');
      }

      expect(spiedBcryptCompareMethod).toHaveBeenCalled();
      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
    });

    it('should return an error if no user found', async () => {
      mockOwnersService.findOneOwner.mockResolvedValue(null);

      try {
        await authService.validateUser('garciano@test.com', 'password');
      } catch (e) {
        expect(e.message).toMatch('Authentication Error');
      }

      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
    });

    it('should return an error if user email is not yet confirmed', async () => {
      owner.confirmed = false;
      mockOwnersService.findOneOwner.mockResolvedValue(owner);

      const spiedBcryptCompareMethod = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      try {
        await authService.validateUser('garciano@test.com', 'password');
      } catch (e) {
        expect(e.message).toMatch('Email not yet confirm');
      }

      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
      expect(spiedBcryptCompareMethod).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return the access_token with user when login', async () => {
      const owner = {
        id: 1,
        name: 'Egie',
        email: 'egie@test.com',
        password: 'password',
        confirmed: true,
        access_token: '',
        role: Role.USER,
      };

      mockOwnersService.findOneOwner.mockResolvedValue(owner);
      mockOwnersService.updateOwner.mockResolvedValue(owner);

      const loginUser = await authService.login(owner);

      expect(loginUser).toMatchObject({ access_token: 'jwtTokenHashString' });
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
      expect(mockOwnersService.updateOwner).toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should create user', async () => {
      const owner = {
        id: 1,
        name: 'Egie',
        email: 'egie@test.com',
        password: 'HashPassword',
        confirmed: false,
        access_token: '',
        role: Role.USER,
      };

      mockOwnersService.findOneOwner.mockResolvedValue(null);

      const spiedBcryptHasheMethod = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('HashPassword'));

      mockOwnersService.createOwner.mockResolvedValue(owner);

      const createOwnerInput = {
        name: 'Egie',
        email: 'egie@test.com',
        password: 'password',
      };

      const createOwner = await authService.signup(createOwnerInput);

      expect(createOwner).toEqual(owner);
      expect(spiedBcryptHasheMethod).toHaveBeenCalled();
      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
      expect(mockOwnersService.createOwner).toHaveBeenCalled();
    });

    it('should create user', async () => {
      const owner = {
        id: 1,
        name: 'Egie',
        email: 'egie@test.com',
        password: 'HashPassword',
        confirmed: false,
        access_token: '',
        role: Role.USER,
      };

      mockOwnersService.findOneOwner.mockResolvedValue(owner);

      const createOwnerInput = {
        name: 'Egie',
        email: 'egie@test.com',
        password: 'password',
      };

      try {
        await authService.signup(createOwnerInput);
      } catch (error) {
        expect(error.message).toMatch('User already exists!');
      }

      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should remove the user access_token and ', async () => {
      const owner = {
        id: 1,
        name: 'Egie',
        email: 'egie@test.com',
        password: 'HashPassword',
        confirmed: true,
        access_token: 'jwtHashToken',
        role: Role.USER,
      };

      mockOwnersService.findOneOwner.mockResolvedValue(owner);
      mockOwnersService.updateOwner.mockResolvedValue(owner);

      const logoutInput = {
        email: 'egie@test.com',
      };

      const logoutUser = await authService.logout(logoutInput);

      expect(logoutUser).toEqual({
        message: 'Successfully logout',
      });
      expect(mockOwnersService.findOneOwner).toHaveBeenCalled();
      expect(mockOwnersService.updateOwner).toHaveBeenCalled();
    });
  });

  describe('adminLogin', () => {
    it('should return an error when no admin found ', async () => {
      mockAdminService.findOneAdmin.mockResolvedValue(null);

      const adminLoginInput = {
        email: 'egie@test.com',
        password: 'password',
      };

      try {
        await authService.adminLogin(adminLoginInput);
      } catch (error) {
        expect(error.message).toEqual('No Admin user found');
        expect(error.extensions.code).toEqual('UNAUTHENTICATED');
      }

      expect(mockAdminService.findOneAdmin).toHaveBeenCalled();
    });

    it('should return an error when password is invalid ', async () => {
      const admin = {
        id: 1,
        email: 'admin@test.com',
        password: 'password',
      };

      mockAdminService.findOneAdmin.mockResolvedValue(admin);

      const spiedBcryptCompareMethod = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      const adminLoginInput = {
        email: 'egie@test.com',
        password: 'password',
      };

      try {
        await authService.adminLogin(adminLoginInput);
      } catch (error) {
        expect(error.message).toEqual('Credentials are invalid');
        expect(error.extensions.code).toEqual('UNAUTHENTICATED');
      }

      expect(mockAdminService.findOneAdmin).toHaveBeenCalled();
      expect(spiedBcryptCompareMethod).toHaveBeenCalled();
    });

    it('should return the aadmin user after successfully login ', async () => {
      const admin = {
        id: 1,
        email: 'admin@test.com',
        password: 'password',
        access_token: '',
      };

      mockAdminService.findOneAdmin.mockResolvedValue(admin);

      const spiedBcryptCompareMethod = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const adminLoginInput = {
        email: 'egie@test.com',
        password: 'password',
      };

      const adminLogin = await authService.adminLogin(adminLoginInput);

      expect(adminLogin).toEqual({
        id: 1,
        email: 'admin@test.com',
        password: 'password',
        access_token: 'jwtTokenHashString',
      });
      expect(mockAdminService.findOneAdmin).toHaveBeenCalled();
      expect(mockAdminService.updateCredential).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalled();
      expect(spiedBcryptCompareMethod).toHaveBeenCalled();
    });
  });

  describe('adminLogout', () => {
    it('should return a message when successfully logout and update adamin access_token', async () => {
      const admin = {
        id: 1,
        email: 'admin@test.com',
        password: 'password',
        access_token: 'JwtHashToken',
      };

      mockAdminService.findOneAdmin.mockResolvedValue(admin);

      const logoutInput = {
        email: 'egie@test.com',
      };

      const logoutAdmin = await authService.adminLogout(logoutInput);

      expect(logoutAdmin).toEqual({
        message: 'Successfully logout.',
      });
      expect(mockAdminService.findOneAdmin).toHaveBeenCalled();
      expect(mockAdminService.updateCredential).toHaveBeenCalled();
    });

    it('should return a message when already logout if access_token is empty', async () => {
      const admin = {
        id: 1,
        email: 'admin@test.com',
        password: 'password',
        access_token: '',
      };

      mockAdminService.findOneAdmin.mockResolvedValue(admin);

      const logoutInput = {
        email: 'egie@test.com',
      };

      const logoutAdmin = await authService.adminLogout(logoutInput);

      expect(logoutAdmin).toEqual({
        message: 'Already logout.',
      });
      expect(mockAdminService.findOneAdmin).toHaveBeenCalled();
    });
  });
});
