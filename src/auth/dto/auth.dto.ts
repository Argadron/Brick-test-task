import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
    @ApiProperty({
        description: "User email",
        type: String, 
        example: "test@test.ru",
        minLength: 3
    })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({
        description: "User password",
        type: String, 
        example: "1234567",
        minLength: 7
    })
    @IsString()
    @MinLength(7)
    readonly password: string;
}