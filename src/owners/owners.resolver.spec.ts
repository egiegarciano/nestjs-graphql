import { Test, TestingModule } from '@nestjs/testing';
import { OwnersResolver } from './owners.resolver';
import { OwnersService } from './owners.service';

describe('OwnersResolver', () => {
  let ownersResolver: OwnersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnersResolver,
        {
          provide: OwnersService,
          useFactory: () => ({
            findAll: jest.fn(() => [
              {
                id: 1,
                name: 'Egie',
                email: 'egie@test.com',
                password: 'password',
              },
              {
                id: 2,
                name: 'Garciano',
                email: 'garciano@test.com',
                password: 'password',
              },
            ]),
            findOneOwner: jest.fn((email: string) => ({
              id: 1,
              name: 'Egie',
              email: email,
              password: 'password',
            })),
            findOwnerAccessToken: jest.fn((id: number) => ({
              id: id,
              name: 'Egie',
              email: 'egie@test.com',
              password: 'password',
              access_token: 'access_token',
            })),
            paginate: jest.fn().mockResolvedValue({
              items: [
                {
                  id: 1,
                  name: 'Egie',
                  email: 'egie@test.com',
                  password: 'password',
                },
                {
                  id: 2,
                  name: 'Garciano',
                  email: 'garciano@test.com',
                  password: 'password',
                },
              ],
              meta: {
                itemCount: 2,
                totalItems: 2,
                totalPages: 1,
                currentPage: 1,
              },
            }),
          }),
        },
      ],
    }).compile();

    ownersResolver = module.get<OwnersResolver>(OwnersResolver);
  });

  it('should be defined', () => {
    expect(ownersResolver).toBeDefined();
  });

  describe('findAll or owners', () => {
    it('should find and return a list of users', async () => {
      const users = await ownersResolver.findAll();
      expect(users).toContainEqual({
        id: 2,
        name: 'Garciano',
        email: 'garciano@test.com',
        password: 'password',
      });
    });
  });

  describe('getMe', () => {
    it('should find and return a user if had access_token', async () => {
      const context = {
        req: {
          user: {
            id: 1,
          },
        },
      };

      const user = await ownersResolver.getMe(context);
      expect(user).toEqual({
        id: 1,
        name: 'Egie',
        email: 'egie@test.com',
        password: 'password',
        access_token: 'access_token',
      });
    });
  });

  describe('ownerPaginate', () => {
    it('should return owners pagination', async () => {
      const paginationOption = {
        limit: 10,
        page: 1,
      };

      const ownerPaginate = await ownersResolver.ownerPaginate(
        paginationOption,
        'test',
      );
      expect(ownerPaginate.items).toContainEqual({
        id: 2,
        name: 'Garciano',
        email: 'garciano@test.com',
        password: 'password',
      });
    });
  });
});
