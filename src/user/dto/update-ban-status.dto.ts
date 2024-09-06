import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateBanStatus {
    @ApiProperty({
        description: "Email to set status",
        type: String,
        minLength: 1,
        example: "test@test.ru"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @IsEmail()
    readonly email: string; 

    @ApiProperty({
        description: "New user ban status (true to ban)",
        type: Boolean,
        example: false
    })
    @IsBoolean()
    @IsNotEmpty()
    readonly banStatus: boolean;
}