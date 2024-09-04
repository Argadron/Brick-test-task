import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtModule} from '@nestjs/jwt';
import { LocalStrategy } from './strategies/jwt.strategy';
import { ConfigModule} from '@nestjs/config';
import { response } from 'express';
import testPrisma from '../prisma.forTest'
import { UserModule } from '../user/user.module';
import 'dotenv/config'
import { EmailModule } from '../email/email.module';

const prisma = testPrisma()

describe('AuthController', () => {
  let controller: AuthController;
  const testNewUser = {
    email: "hello1@mail.ru",
    password: "12345678"
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: "secret"
      }), UserModule, ConfigModule.forRoot(), EmailModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, LocalStrategy],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Test register new user', async () => {
    expect((await controller.register(testNewUser, response)).access).toBeDefined();
  });

  it("Test login user", async () => {
    expect((await controller.login(testNewUser, response)).access).toBeDefined()
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: "hello1@mail.ru"
      }
    })
  })
});