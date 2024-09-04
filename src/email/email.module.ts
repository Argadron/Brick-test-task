import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailController } from "./email.controller";
import { UserModule } from "../user/user.module";
import { EmailService } from "./email.service";
import { PrismaService } from "../prisma.service";

@Module({
    imports: [UserModule],
    controllers: [EmailController],
    providers: [EmailService, ConfigService, PrismaService],
    exports: [EmailService, ConfigService]
})
export class EmailModule {}