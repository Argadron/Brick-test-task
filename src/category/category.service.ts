import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    private async getByIdOrThrow(id: number) {
        const category = await this.prismaService.category.findUnique({
            where: {
                id
            }
        })

        if (!category) throw new NotFoundException(`Category not found`)

        return category
    }

    async getAll() {
        return await this.prismaService.category.findMany()
    }

    async create(dto: CreateCategoryDto) {
        return await this.prismaService.category.create({
            data: {
                ...dto
            }
        })
    }

    async update(dto: UpdateCategoryDto, id: number) {
        await this.getByIdOrThrow(id)

        return await this.prismaService.category.update({
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

        await this.prismaService.category.delete({
            where: {
                id
            }
        })

        return undefined
    } 

    async getById(id: number) {
        return await this.prismaService.category.findUnique({
            where: {
                id
            }
        })
    }
}
