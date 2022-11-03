import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pet } from 'src/entities/pet.entity';
import { CreatePetInput } from './dto/create-pet.input';
import { OwnersService } from 'src/owners/owners.service';
import { Owner } from 'src/entities/owner.entity';
import { createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import { join, parse } from 'path';
import { FileUpload } from 'graphql-upload';
import { updatePetInput } from './dto/update-pet.input';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet) private petsRepository: Repository<Pet>,
    private readonly ownerService: OwnersService,
  ) {}

  async createPet(input: CreatePetInput, image: FileUpload): Promise<Pet> {
    // How to validate the image file upload
    const { createReadStream, filename } = image;
    const { name, ownerId, type } = input;

    // you can parse the filename and get the name and its extension
    // const { ext, name } = parse(filename);

    // how about handling multi request files

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const modifiedFilename = uniqueSuffix + '-' + filename;

    createReadStream().pipe(
      createWriteStream(
        join(process.cwd(), `./src/upload/${modifiedFilename}`),
      ),
    );

    const newPet = this.petsRepository.create({
      image: modifiedFilename,
      name,
      type,
      ownerId,
    });

    return await this.petsRepository.save(newPet);
  }

  async updatePetInfo(updatePetInfo: updatePetInput, newImage: FileUpload) {
    const { id, name, ownerId, type } = updatePetInfo;

    const pet = await this.petsRepository.findOneBy({
      id,
    });

    if (!pet) throw new Error('Pet does not exist');

    if (!!newImage) {
      const { createReadStream, filename: newFilename } = newImage;

      // Remove the old image file
      try {
        await unlink(join(process.cwd(), `./src/upload/${pet.image}`));
      } catch (error) {
        console.log('Error happend while deleting the file', error);
      }

      // Synchronous
      // unlink('path/file.txt', (err) => {
      //   if (err) throw err;
      //   console.log('path/file.txt was deleted');
      // });

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const modifiedFilename = uniqueSuffix + '-' + newFilename;

      createReadStream().pipe(
        createWriteStream(
          join(process.cwd(), `./src/upload/${modifiedFilename}`),
        ),
      );

      pet.image = modifiedFilename;
    }

    pet.name = name || pet.name;
    pet.type = type || pet.type;

    return await this.petsRepository.save(pet);

    // return {
    //   message: 'Update image successfully',
    // };
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.find(); // SELECT * pet
  }

  findOne(id: number): Promise<Pet> {
    return this.petsRepository.findOneBy({ id });
  }

  getOwner(ownerId: number): Promise<Owner> {
    return this.ownerService.findOnePetOwner(ownerId);
  }
}
