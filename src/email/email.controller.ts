import { Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "@decorators/get-user.decorator";
import { Auth } from "@decorators/auth.decorator";
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated, SwaggerNoContent, SwaggerNotFound, SwaggerUnauthorizedException } from "@swagger/apiResponse.interfaces";
import { JwtUser } from "../auth/interfaces";
import { EmailService } from "./email.service";

@Controller("/email")
@ApiTags("Email Controller")
@Auth()
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post("/createVerification")
    @ApiOperation({ summary: "Send a verification email message to email" })
    @ApiResponse({ status: 201, description: "Email sended", type: SwaggerCreated })
    @ApiResponse({ status: 400, description: "User not has email", type: SwaggerBadRequest })
    @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
    @ApiResponse({ status: 404, description: "User not found", type: SwaggerNotFound })
    @ApiResponse({ status: 409, description: "Email already sended (lt 5 mins from last) / User already has verification", type: SwaggerConflictMessage })
    @ApiBearerAuth()
    async createVerification(@User() user: JwtUser) {
        return await this.emailService.createVerification(user)
    }

    @Get("/verifyEmailConfirmTag")
    @ApiOperation({ summary: "Verify the confirm token" })
    @ApiResponse({ status: 204, description: "Tag verifed", type: SwaggerNoContent })
    @ApiResponse({ status: 400, description: "Tag must be writed", type: SwaggerBadRequest })
    @ApiResponse({ status: 401, description: "Token Invalid/Unauthorized", type: SwaggerUnauthorizedException })
    @ApiResponse({ status: 404, description: "Tag not found", type: SwaggerNotFound })
    @ApiBearerAuth()
    @HttpCode(204)
    async validateTag(@Query("urlTag") tag: string) {
      return await this.emailService.validateTag(tag)
    }
}