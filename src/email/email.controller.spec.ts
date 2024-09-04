import { Test, TestingModule } from '@nestjs/testing'
import { EmailController } from './email.controller'
import { ExecutionContext } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express'
import { RoleEnum } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import prismaTestClient from '../prisma.forTest'
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid'
import { JwtGuard } from '../auth/guards/jwt.guard';

const prisma = prismaTestClient()

describe("EmailController", () => {
    let controller: EmailController;
    const testJwtUser = {
      id: 64,
      role: RoleEnum.USER
    }
    let tag: string;

    beforeAll(async () => {
        const { urlTag } = await prisma.emailConfirms.create({
          data: { userId: 3, urlTag: v4() }
        })

        tag = urlTag
    })

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [UserModule],
          controllers: [EmailController],
          providers: [EmailService, ConfigService, PrismaService, JwtService],
        }).overrideGuard(JwtGuard).useValue({
          canActivate: (ctx: ExecutionContext) => {
            const request: Request = ctx.switchToHttp().getRequest()
    
            request["user"] = {
              id: 64,
              role: RoleEnum.USER
            }
    
            return true
          }
        }).compile();
    
        controller = module.get<EmailController>(EmailController);
      });

  it("Проверка отправки письма на подтверждение почты", async () => {
    expect((await controller.createVerification(testJwtUser)).urlTag).toBeDefined()
  })

  it("Проверка валидации тега на подтверждение email", async () => {
    expect((await controller.validateTag(tag))).toBeUndefined()
  })

  afterAll(async () => {
    await prisma.emailConfirms.deleteMany({
        where: {
            userId: 64
        }
    })
})
})