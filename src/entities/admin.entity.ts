import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from 'src/lib/enums/role.enum';

@Entity()
@ObjectType()
export class Admin {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'longtext' })
  @Field({ nullable: true }) // is it fine to expose access token in graphql field? I think it's since we're gonna set access token to cookies
  access_token: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  @Field(() => Role)
  role: Role;
}
