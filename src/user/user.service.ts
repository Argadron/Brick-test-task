import { Injectable } from '@nestjs/common';
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
}