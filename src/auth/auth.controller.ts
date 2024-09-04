import { Body, Controller, Get, HttpCode, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { AuthDto } from './dto/auth.dto';
import { Token } from '@decorators/get-token.decorator';
import { Response } from 'express';

@Controller('auth')
@ApiTags("Auth Controller")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register new user" })
  @ApiResponse({ description: "User registred", status: 201, type: SwaggerCreated })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Email conflict", status: 409, type: SwaggerConflictMessage })
  @UsePipes(new ValidationPipe())
  @Post("/register")
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.register(dto, res)
  }

  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ description: "User logined", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Validation failed/Bad password or username", status: 400, type: SwaggerBadRequest })
  @UsePipes(new ValidationPipe())
  @Post("/login")
  @HttpCode(200)
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(dto, res)
  }

  @ApiOperation({ summary: "Refresh tokens" })
  @ApiResponse({ description: "Tokens refreshed", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiCookieAuth(process.env.REFRESH_TOKEN_COOKIE_NAME)
  @Get("/refresh")
  async refresh(@Token() token: string, @Res({ passthrough: true }) res: Response) {
    return await this.authService.refresh(token, res)
  }
}
