import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { OwnersModule } from 'src/owners/owners.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminModule } from 'src/admin/admin.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // read more in nestjs config global
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET, //`${process.env.JWT_SECRET}`
    }),
    OwnersModule,
    AdminModule,
    MailerModule,
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
