import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtUser } from './interfaces';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { v4 } from 'uuid';
import { RoleEnum } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,
                private readonly userService: UserService,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
                private readonly emailService: EmailService
    ) {}

    private async generateTokens(userId: number, role: string, isBanned: boolean) {
        const testExpires = this.configService.get("NODE_ENV") === "test" ? 50 : undefined

        const access = await this.jwtService.signAsync({
            id: userId,
            role,
            isBanned
        }, {
            expiresIn: testExpires ? testExpires : this.configService.get("JWT_ACCESS_EXPIRES")
        })

        const refresh = await this.jwtService.signAsync({
            id: userId
        }, {
            expiresIn: testExpires ? testExpires : this.configService.get("JWT_REFRESH_EXPIRES")
        })

        return { access, refresh }
    }

    private getNumberJwtRefreshExpires() {
        const defaultExp = 30 * 24 * 60 * 60 * 1000

        const stringJwtRefreshExp = this.configService.get("JWT_REFRESH_EXPIRES")

        if (!stringJwtRefreshExp) return defaultExp;

        const numberJwtRefreshExp = parseInt(stringJwtRefreshExp.replace("d", ""))

        if (isNaN(numberJwtRefreshExp)) return defaultExp; 

        return numberJwtRefreshExp * 24 * 60 * 60 * 1000
    }

    private addRefreshToResponse(res: Response, token: string) {
        if (this.configService.get("NODE_ENV") === "test") return;

        res.cookie(this.configService.get("REFRESH_TOKEN_COOKIE_NAME"), token, {
            httpOnly: true,
            secure: true,
            sameSite: this.configService.get("NODE_ENV") === "production" ? "lax":"none",
            maxAge: this.getNumberJwtRefreshExpires(),
            domain: this.configService.get("HOST")
        })
    }

    async register(dto: AuthDto, res: Response) {
        if (await this.userService.findBy({ email: dto.email })) throw new ConflictException("This email already exsists!")

        const { id } = await this.userService.create({
            email: dto.email,
            password: await bcrypt.hash(dto.password, 3)
        })

        const { access, refresh } = await this.generateTokens(id, RoleEnum.USER, false)

        const urlTag = v4()
        const url = `${this.configService.get(`API_CLIENT_URL`)}/emailConfirms?urlTag=${urlTag}`

        this.addRefreshToResponse(res, refresh)

        await this.emailService.sendEmailWithCreateTag({ subject: "Email confirm", text: "Confirm email", to: dto.email, templateObject: { email: dto.email, action: "Confirm email", url } }, { urlTag, userId: id })

        return { access, message: "Пришло письмо для подтверждения почты!" }
    }

    async login(dto: AuthDto, res: Response) {
        const User = await this.userService.findBy({ email: dto.email })

        if (!User) throw new BadRequestException("Bad password or username")

        if (!await bcrypt.compare(dto.password, User.password)) throw new BadRequestException("Bad password or username")

        const { access, refresh } = await this.generateTokens(User.id, User.role, User.isBanned)

        this.addRefreshToResponse(res, refresh)

        return { access }
    }

    async refresh(token: string, res: Response) {
        if (!token || !token.split("")[1]) throw new UnauthorizedException("No refresh token")

        try {
            const { id, role, isBanned } = await this.jwtService.verifyAsync<JwtUser>(token)

            const { access, refresh } = await this.generateTokens(id, role, isBanned)

            this.addRefreshToResponse(res, refresh)

            return { access }
        } catch(e) {
            throw new UnauthorizedException("Refresh token invalid")
        }
    }
}
