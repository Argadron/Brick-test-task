import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUser } from './interfaces';
import { UpdateBanStatus } from './dto/update-ban-status.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getById(userId: number) {
        return await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })
    }

    async findBy(find: Object) {
        return await this.prismaService.user.findFirst({ where: find })
    }

    async create(data: CreateUser) {
        return await this.prismaService.user.create({
            data
        })
    }

    async update(data: Object, userId: number) {
        return await this.prismaService.user.update({
            where: {
                id: userId
            },
            data
        })
    }

    async getProfile(userId: number) {
        const User = await this.getById(userId)

        if (User.isBanned) throw new BadRequestException(`User is banned!`)

        if (!User.isEmailVerify) throw new BadRequestException(`User not has verifed email!`)

        const { password, ...returnInfo } = User

        return returnInfo
    }

    async setBanStatus(dto: UpdateBanStatus) {
        const User = await this.findBy({ email: dto.email })

        if (!User) throw new NotFoundException(`User not found`)

        await this.prismaService.user.update({
            where: {
                email: dto.email
            },
            data: {
                isBanned: dto.banStatus
            }
        })

        return undefined
    }
}