import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateEventDto {
    @ApiProperty({
        description: "New event name",
        type: String,
        minLength: 1,
        example: "Mega tournament",
        required: false
    })
    @Exclude()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @IsOptional()
    readonly name?: string;

    @ApiProperty({
        description: "New event description",
        type: String,
        minLength: 1,
        example: "Mega CS2 tournament",
        required: false
    })
    @Exclude()
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @IsOptional()
    readonly categoryId: number;
}