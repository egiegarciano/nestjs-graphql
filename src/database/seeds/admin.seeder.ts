import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Admin } from 'src/entities/admin.entity';
import * as bcrypt from 'bcrypt';

export default class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const adminRepository = dataSource.getRepository(Admin);

    const adminPassword = await bcrypt.hash('password', 10);

    const adminData = {
      name: 'admin',
      email: 'admin@test.com',
      password: adminPassword,
    };

    const userExists = await adminRepository.findOneBy({
      email: adminData.email,
    });

    if (!userExists) {
      const newAdmin = adminRepository.create(adminData);
      await adminRepository.save(newAdmin);
    }
  }
}
