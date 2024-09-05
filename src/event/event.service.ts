import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEvent } from './dto/create-event.dto';
import { UpdateEvent } from './dto/update-event.dto';

@Injectable()
export class EventService {
    constructor(private readonly prismaSerivce: PrismaService) {}

    private async getByIdOrThrow(id: number) {
        const event = await this.prismaSerivce.event.findUnique({
            where: {
                id
            }
        })

        if (!event) throw new NotFoundException(`Event not found`)

        return event
    }

    async getAll() {
        return await this.prismaSerivce.event.findMany()
    }

    async register(userId: number, id: number) {
        await this.getByIdOrThrow(id)

        if (await this.prismaSerivce.userEvents.findUnique({ where: { userId, id } })) throw new ConflictException(`Already register to this event!`)

        return await this.prismaSerivce.userEvents.create({
            data: {
                userId,
                eventId: id
            }
        })
    }

    async unRegister(userId: number, id: number) {
        await this.getByIdOrThrow(id)

        if (!await this.prismaSerivce.userEvents.findUnique({ where: { id, userId } })) throw new BadRequestException(`You not registred to this event`)

        await this.prismaSerivce.userEvents.delete({
            where: {
                id, userId
            }
        })

        return undefined
    }

    async create(dto: CreateEvent) {
        // СДЕЛАТЬ ПРОВЕРКУ ПО КАТЕГОРИЯМ !
        return await this.prismaSerivce.event.create({
            data: {
               ...dto
            }
        })
    }

    async update(dto: UpdateEvent, id: number) {
        await this.getByIdOrThrow(id)

        return await this.prismaSerivce.event.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        })
    }

    async delete(id: number) {
        await this.getByIdOrThrow(id)

        await this.prismaSerivce.event.delete({
            where: {
                id
            }
        })

        return undefined
    }
}
