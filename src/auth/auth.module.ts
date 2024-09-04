import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET
  }), EmailModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, ConfigService, PrismaService],
})
export class AuthModule {}
