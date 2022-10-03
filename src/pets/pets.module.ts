import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from 'src/entities/pet.entity';
import { OwnersModule } from 'src/owners/owners.module';
import { PetsReolver } from 'src/pets/pets.resolver';
import { PetService } from 'src/pets/pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), OwnersModule],
  providers: [PetService, PetsReolver],
})
export class PetsModule {}
