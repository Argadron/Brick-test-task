import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleEnum } from '@prisma/client';
import { CreateEvent } from './dto/create-event.dto';
import { UpdateEvent } from './dto/update-event.dto';
import { OptionalValidatorPipe } from '@pipes/optional-validator.pipe';
import { ExcessPlantsValidatorPipe } from '@pipes/excess-plants-validator.pipe';

@Controller('event')
@ApiTags(`Event Controller`)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: "Get all events" })
  @ApiResponse({ description: "Events getted", status: 200, type: SwaggerOK })
  @Get(`/all`)
  async getAll() {
    return await this.eventService.getAll()
  }

  @ApiOperation({ summary: "Register to event" })
  @ApiResponse({ description: "Register successfly", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "Event not found", status: 404, type: SwaggerNotFound })
  @ApiResponse({ description: "Already register to this event", status: 409, type: SwaggerConflictMessage })
  @ApiBearerAuth()
  @Auth()
  @Post(`/register/:id`)
  @HttpCode(200)
  async register(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.eventService.register(user.id, id)
  }

  @ApiOperation({ summary: "Unregistr from event" })
  @ApiResponse({ description: "Unregister successfly", status: 204, type: SwaggerNoContent })
  @ApiResponse({ description: "You are not register to this event", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "Event not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @Delete(`/unregister/:id`)
  @HttpCode(204)
  async unRegister(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.eventService.unRegister(user.id, id)
  }

  @ApiOperation({ summary: "Create new event" })
  @ApiResponse({ description: "New event created", status: 201, type: SwaggerCreated })
  @ApiResponse({ description: "Validaition failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "You not have access to this action", status: 403, type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @Auth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Post(`/create`)
  async create(@Body() dto: CreateEvent) {
    return await this.eventService.create(dto)
  }

  @ApiOperation({ summary: "Edit event" })
  @ApiResponse({ description: "Event edited", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Validaition failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "You not have access to this action", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Event not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe(), new OptionalValidatorPipe().check(["name", "description", "categoryId"]), 
  new ExcessPlantsValidatorPipe().setType(UpdateEvent))
  @Put(`/update/:id`)
  async update(@Body() dto: UpdateEvent, @Param("id", ParseIntPipe) id: number) {
    return await this.eventService.update(dto, id)
  }

  @ApiOperation({ summary: "Delete event" })
  @ApiResponse({ description: "Event deleted", status: 204, type: SwaggerNoContent })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "You not have access to this action", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Event not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(`/delete/:id`)
  @HttpCode(204)
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.eventService.delete(id)
  }
}
