import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PetsModule } from './pets/pets.module';
import { OwnersModule } from './owners/owners.module';
import { AppDataSource } from 'ormconfig';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CustomEmailScalar } from './lib/custom-scalar-type/GraphQLEmail';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
      driver: ApolloDriver,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      // debug: false,
      csrfPrevention: true,
      // resolvers: { Email: CustomEmailScalar },
    }),
    PetsModule,
    OwnersModule,
    AuthModule,
    AdminModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
