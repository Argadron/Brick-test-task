import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { User } from '@decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { Auth } from '@decorators/auth.decorator';

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
}