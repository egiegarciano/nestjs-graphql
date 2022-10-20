import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Owner } from 'src/entities/owner.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(Owner);
    // save 1 factory generated entity, to the database
    // await userFactory.save();

    // save 5 factory generated entities, to the database
    await userFactory.saveMany(10);
  }
}
