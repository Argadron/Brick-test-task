import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { LocalStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { response } from 'express';
import testPrisma from '../prisma.forTest'
import { UserModule } from '../user/user.module';
import 'dotenv/config'
import { EmailModule } from '../email/email.module';

const prisma = testPrisma()

describe('AuthService', () => {
  let service: AuthService;
  const testNewUser = {
    email: "hello@mail.ru",
    password: "12345678"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret",
      }), UserModule, ConfigModule.forRoot(), EmailModule],
      providers: [AuthService, PrismaService, LocalStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Test register new user', async () => {
    expect((await service.register(testNewUser, response)).access).toBeDefined();
  });

  it("Test login user", async () => {
    expect((await service.login(testNewUser, response)).access).toBeDefined()
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: "hello@mail.ru"
      }
    })
  })
});