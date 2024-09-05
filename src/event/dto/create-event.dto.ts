import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateEventDto {
    @ApiProperty({
        description: "Event name",
        type: String,
        minLength: 1,
        example: "Tournament"
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({
        description: "Event description",
        type: String,
        minLength: 1,
        example: "CS2 tournament"
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    readonly description: string;

    @ApiProperty({
        description: "Category id",
        type: Number,
        minimum: 1,
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    readonly categoryId: number;
}