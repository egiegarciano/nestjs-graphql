import { Test, TestingModule } from '@nestjs/testing';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Role } from '../lib/enums/role.enum';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    adminLogin: jest.fn(),
    adminLogout: jest.fn(),
    confirmUserEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('login', () => {
    it('should return the user after login', async () => {
      const owner = {
        access_token: '',
        owner: {
          id: 1,
          name: 'Egie',
          email: 'egie@test.com',
          password: 'HashPassword',
          confirmed: false,
          access_token: 'JwtHashToken',
          role: Role.USER,
        },
      };
      mockAuthService.login.mockResolvedValue(owner);

      const loginInput = {
        email: 'egie@test.com',
        password: 'password',
      };

      const context = {
        user: {
          id: 1,
          name: 'Egie',
          email: 'egie@test.com',
          password: 'HashPassword',
          confirmed: false,
          access_token: '',
          role: Role.USER,
        },
      };

      const userLogin = await authResolver.login(loginInput, context);

      expect(userLogin).toEqual(owner);
      expect(mockAuthService.login).toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should return the created user', async () => {
      const owner = {
        id: 1,
        name: 'Egie',
        email: 'egie@test.com',
        password: 'HashPassword',
        confirmed: false,
        access_token: '',
        role: Role.USER,
      };

      mockAuthService.signup.mockResolvedValue(owner);

      const signupInput = {
        name: 'Egie',
        email: 'egie@test.com',
        password: 'password',
      };

      const userSignup = await authResolver.signup(signupInput);

      expect(userSignup).toEqual(owner);
      expect(mockAuthService.signup).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should return a message that says logout successfully', async () => {
      const message = {
        message: 'Successfully logout',
      };

      mockAuthService.logout.mockResolvedValue(message);

      const logoutInput = {
        email: 'egie@test.com',
      };

      const userSignup = await authResolver.logout(logoutInput);

      expect(userSignup).toEqual(message);
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });

  describe('adminLogin', () => {
    it('should return a admin after login successfully', async () => {
      const admin = {
        id: 1,
        name: 'Admin',
        email: 'admin@test.com',
        password: 'HashPassword',
        access_token: 'JwtHashToken',
        role: Role.ADMIN,
      };

      mockAuthService.adminLogin.mockResolvedValue(admin);

      const adminLoginInput = {
        email: 'egie@test.com',
        password: 'password',
      };

      const adminLogin = await authResolver.adminLogin(adminLoginInput);

      expect(adminLogin).toEqual(admin);
      expect(mockAuthService.adminLogin).toHaveBeenCalled();
    });
  });

  describe('adminLogout', () => {
    it('should return a message after admin logout successfully', async () => {
      const message = {
        message: 'Successfully logout',
      };

      mockAuthService.adminLogout.mockResolvedValue(message);

      const adminLogoutInput = {
        email: 'egie@test.com',
      };

      const adminLogout = await authResolver.adminLogout(adminLogoutInput);

      expect(adminLogout).toEqual(message);
      expect(mockAuthService.adminLogout).toHaveBeenCalled();
    });
  });

  describe('confirmOwnerEmail', () => {
    it('should return the owner after updating confirmed', async () => {
      const owner = {
        id: 1,
        name: 'Egie',
        email: 'egie@test.com',
        password: 'HashPassword',
        confirmed: true,
        access_token: '',
        role: Role.USER,
      };

      mockAuthService.confirmUserEmail.mockResolvedValue(owner);

      const confirmOwnerEmail = await authResolver.confirmOwnerEmail(
        'egie@test.com',
      );

      expect(confirmOwnerEmail).toEqual(owner);
      expect(mockAuthService.confirmUserEmail).toHaveBeenCalled();
    });
  });
});
