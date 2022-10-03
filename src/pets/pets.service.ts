import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pet } from 'src/entities/pet.entity';
import { CreatePetInput } from './dto/create-pet.input';
import { OwnersService } from 'src/owners/owners.service';
import { Owner } from 'src/entities/owner.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet) private petsRepository: Repository<Pet>,
    private readonly ownerService: OwnersService,
  ) {}

  createPet(createPetInput: CreatePetInput): Promise<Pet> {
    const newPet = this.petsRepository.create(createPetInput);

    return this.petsRepository.save(newPet); // insert
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.find(); // SELECT * pet
  }

  findOne(petId: number): Promise<Pet> {
    return this.petsRepository.findOneBy({ id: petId });
  }

  getOwner(ownerId: number): Promise<Owner> {
    return this.ownerService.findOnePetOwner(ownerId);
  }
}
