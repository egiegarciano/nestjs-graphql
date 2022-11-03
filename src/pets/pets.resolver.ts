import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload';

import { Pet } from 'src/entities/pet.entity';
import { Owner } from 'src/entities/owner.entity';
import { CreatePetInput } from './dto/create-pet.input';
import { PetService } from './pets.service';
import { updatePetInput } from './dto/update-pet.input';

@Resolver(() => Pet)
export class PetsReolver {
  constructor(private petService: PetService) {}

  @Query(() => [Pet])
  pets(): Promise<Pet[]> {
    return this.petService.findAll();
  }

  @Query(() => Pet)
  getPet(@Args('id', { type: () => Int }) id: number): Promise<Pet> {
    return this.petService.findOne(id);
  }

  @ResolveField(() => Owner)
  owner(@Parent() pet: Pet): Promise<Owner> {
    return this.petService.getOwner(pet.ownerId);
  }

  @Mutation(() => Pet)
  createPet(
    @Args('createPetInput') createPetInput: CreatePetInput,
    @Args('image', { type: () => GraphQLUpload })
    image: FileUpload,
  ): Promise<Pet> {
    return this.petService.createPet(createPetInput, image);
  }

  // modify this api to also update other info of the pet
  @Mutation(() => Pet)
  updatePetInfo(
    @Args('updatePetInfo') updatePetInfo: updatePetInput,
    @Args('newimage', { type: () => GraphQLUpload, nullable: true })
    newImage?: FileUpload,
  ): Promise<Pet> {
    return this.petService.updatePetInfo(updatePetInfo, newImage);
  }
}
