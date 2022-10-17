import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'nest-graphql',
  entities: ['dist/**/*.entity.js'],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrations: ['dist/**/migrations/*.js'],

  seeds: ['dist/**/*.seeder.js'],
};

export const AppDataSource = new DataSource(options);
