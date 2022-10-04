import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOwnerInput } from './dto/create-owner.input';
import { Owner } from '../entities/owner.entity';
import { OwnerResponse } from 'src/auth/dto/owner-response';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner) private ownersRespository: Repository<Owner>,
  ) {}

  createOwner(createOwnerInput: CreateOwnerInput): Promise<Owner> {
    const newOwner = this.ownersRespository.create(createOwnerInput);

    return this.ownersRespository.save(newOwner);
  }

  findAll(): Promise<Owner[]> {
    return this.ownersRespository.find();
  }

  findOnePetOwner(id: number): Promise<Owner> {
    return this.ownersRespository.findOneOrFail({ where: { id: id } });
  }

  findOneOWner(username: string): Promise<Owner> {
    return this.ownersRespository.findOne({
      where: { username },
    });
  }

  updateCredential(owner: OwnerResponse) {
    return this.ownersRespository.save(owner);
  }

  remove(id: number) {
    return `This action removes a #${id} owner`;
  }
}
