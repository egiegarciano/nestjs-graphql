import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AdminService } from '../admin/admin.service';
import { MailerService } from '../mailer/mailer.service';
import { OwnersService } from '../owners/owners.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  const mockOwnersService = {
    findOneOwner: jest.fn(),
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
          useValue: {},
        },
        {
          provide: AdminService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
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

    it('should return an error if no user email not yet confirmed', async () => {
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
});
