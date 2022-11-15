import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entities/admin.entity';
import { Repository } from 'typeorm';

import { CreateAdminInput } from './dto/create-admin.input';
import { UpdateAdminInput } from './dto/update-admin.input';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRespository: Repository<Admin>,
  ) {}

  // findAll() {
  //   return `This action returns all admin`;
  // }

  async findOneAdmin(email: string): Promise<Admin> {
    return await this.adminRespository.findOne({
      where: { email },
    });
  }

  updateCredential(admin: Admin) {
    return this.adminRespository.save(admin);
  }

  async findAdminAccessToken(adminId: number): Promise<Admin> {
    const admin = await this.adminRespository.findOne({
      where: { id: adminId },
    });

    if (!admin || !admin.access_token) {
      throw new UnauthorizedException('User is not logged in');
    }

    return admin;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
