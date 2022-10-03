import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pet } from 'src/entities/pet.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Owner {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Pet, (pet) => pet.owner)
  @Field(() => [Pet], { nullable: true }) // When the field is an array, we must manually indicate the array type in the Field() decorator's type function, as shown below:
  pets?: Pet[];
}
