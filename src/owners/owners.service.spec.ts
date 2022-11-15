import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UnauthorizedException } from '@nestjs/common';
import { Owner } from '../entities/owner.entity';
import { OwnersService } from './owners.service';
import { Role } from '../lib/enums/role.enum';

jest.mock('nestjs-typeorm-paginate', () => ({
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
}));

describe('OwnersService', () => {
  let ownersservice: OwnersService;

  const mockOwnersRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnersService,
        { provide: getRepositoryToken(Owner), useValue: mockOwnersRepository },
      ],
    }).compile();

    ownersservice = module.get<OwnersService>(OwnersService);
  });

  it('should be defined', () => {
    expect(ownersservice).toBeDefined();
  });

  it('it should create new owner and return promise owner', async () => {
    const ownerDTO = {
      id: 1,
      name: 'Egie',
      email: 'egie@test.com',
      password: 'password',
    };

    expect(await ownersservice.createOwner(ownerDTO)).toEqual(ownerDTO);
    expect(mockOwnersRepository.create).toHaveBeenCalled();
    expect(mockOwnersRepository.save).toHaveBeenCalled();
  });

  it('it should find all users', async () => {
    const owners = [
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
    ];

    mockOwnersRepository.find.mockReturnValue(owners);

    const findAllOwners = await ownersservice.findAll();

    expect(findAllOwners).toContainEqual({
      id: 2,
      name: 'Garciano',
      email: 'garciano@test.com',
      password: 'password',
    });
    expect(mockOwnersRepository.find).toHaveBeenCalled();
  });

  it('it should find one user', async () => {
    const owner = {
      id: 1,
      name: 'Egie',
      email: 'egie@test.com',
      password: 'password',
    };

    mockOwnersRepository.findOne.mockReturnValue(owner);

    const findOneOwner = await ownersservice.findOneOwner(owner.email);

    expect(findOneOwner).toEqual(owner);
    expect(mockOwnersRepository.findOne).toHaveBeenCalled();
  });

  it('it should update one user', async () => {
    const owner = {
      id: 1,
      name: 'Egie',
      email: 'egie@test.com',
      password: 'password',
      access_token: null,
      role: Role.USER,
      confirmed: false,
    };

    // mockOwnersRepository.save.mockReturnValue(owner);

    const updateOwner = await ownersservice.updateOwner(owner);

    expect(updateOwner).toMatchObject(owner);
    expect(mockOwnersRepository.save).toHaveBeenCalledWith(owner);
  });

  it('it should find user with access_token', async () => {
    const owner = {
      id: 1,
      name: 'Egie',
      email: 'egie@test.com',
      password: 'password',
      access_token: 'secret_token',
    };

    mockOwnersRepository.findOne.mockReturnValue(owner);

    const findOwnerAccessToken = await ownersservice.findOwnerAccessToken(
      owner.id,
    );

    expect(findOwnerAccessToken).toMatchObject(owner);
    expect(mockOwnersRepository.findOne).toHaveBeenCalled();
  });

  it('it should return error when access token in null or undefined', async () => {
    const owner = {
      id: 1,
      name: 'Egie',
      email: 'egie@test.com',
      password: 'password',
      access_token: null,
    };

    mockOwnersRepository.findOne.mockReturnValueOnce(owner);

    try {
      await ownersservice.findOwnerAccessToken(owner.id);
    } catch (e) {
      expect(e.response).toEqual({
        statusCode: 401,
        message: 'User is not logged in',
        error: 'Unauthorized',
      });
    }

    expect(mockOwnersRepository.findOne).toHaveBeenCalled();
  });

  it('pagination', async () => {
    const paginationOption = {
      limit: 10,
      page: 1,
    };

    const ownerPagination = await ownersservice.paginate(
      paginationOption,
      'test',
    );

    expect(ownerPagination.items).toContainEqual({
      id: 2,
      name: 'Garciano',
      email: 'garciano@test.com',
      password: 'password',
    });
    expect(mockOwnersRepository.createQueryBuilder).toHaveBeenCalled();
  });
});
