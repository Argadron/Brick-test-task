import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: "Category name",
        type: String,
        minLength: 1,
        example: "Games"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    readonly name: string;
}