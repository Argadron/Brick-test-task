import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUser } from './interfaces';

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
}