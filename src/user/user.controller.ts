import { Body, Controller, Get, HttpCode, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { User } from '@decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { Auth } from '@decorators/auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';
import { UpdateBanStatus } from './dto/update-ban-status.dto';

@Controller('user')
@ApiTags("Users controller")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({ description: "Profile sended", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "User banned / Email not verifed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  @Auth()
  @Get("/profile")
  async getProfile(@User() user: JwtUser) {
    return await this.userService.getProfile(user.id)
  }

  @ApiOperation({ summary: "Set user ban status" })
  @ApiResponse({ description: "User ban status setted", status: 204, type: SwaggerNoContent })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "You not have access to this action", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "User not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Auth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(new ValidationPipe())
  @Put(`/banStatus`)
  @HttpCode(204)
  async setUserBanStatus(@Body() dto: UpdateBanStatus) {
    return await this.userService.setBanStatus(dto)
  }
}