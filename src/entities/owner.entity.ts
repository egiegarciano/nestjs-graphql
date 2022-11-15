import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Pet } from '../entities/pet.entity';
import { Role } from '../lib/enums/role.enum';

@Entity()
@ObjectType()
export class Owner {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column() // email should be unique
  @Field()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'longtext' })
  @Field({ nullable: true })
  access_token: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @Field(() => Role)
  role: Role;

  @OneToMany(() => Pet, (pet) => pet.owner)
  @Field(() => [Pet], { nullable: true }) // When the field is an array, we must manually indicate the array type in the Field() decorator's type function, as shown below:
  pets?: Pet[];

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;
}
