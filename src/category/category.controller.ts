import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { Roles } from '@decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Auth } from '@decorators/auth.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@ApiTags(`Category Controller`)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ description: "Categories getted", status: 200, type: SwaggerOK })
  @Get(`/all`)
  async getAll() {
    return await this.categoryService.getAll()
  }

  @ApiOperation({ summary: "Create new category" })
  @ApiResponse({ description: "Category created", status: 201, type: SwaggerCreated })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "You not have access to this action", status: 403, type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @Auth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Post(`/create`)
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto)
  }

  @ApiOperation({ summary: "Update category" })
  @ApiResponse({ description: "Category updated", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "You not have access to this action", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Category not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @Roles(RoleEnum.ADMIN)
  @UsePipes(new ValidationPipe())
  @Put(`/update/:id`)
  async update(@Body() dto: UpdateCategoryDto, @Param("id", ParseIntPipe) id: number) {
    return await this.categoryService.update(dto, id)
  }

  @ApiOperation({ summary: "Delete category" })
  @ApiResponse({ description: "Category deleted", status: 204, type: SwaggerNoContent })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "You not have access to this action", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Category not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @Roles(RoleEnum.ADMIN)
  @Delete(`/delete/:id`)
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.categoryService.delete(id)
  }
}
