import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateCategoryDto {
    @ApiProperty({
        description: "New category name",
        type: String,
        minLength: 1,
        example: "Mega ames"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @IsOptional()
    readonly name?: string;
}