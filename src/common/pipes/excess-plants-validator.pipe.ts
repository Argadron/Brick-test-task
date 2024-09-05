import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

/**
 * This pipe validate, if DTO have excess plants, throw bad request error and give client not accessed plant
 * Example: We have userDto (username, password). If client send username, password and secure plant - throw bad request,
 * return message: "Plant secure" is not in dto
 */
@Injectable()
export class ExcessPlantsValidatorPipe implements PipeTransform {
    private type: any = {};

    transform(value: any, metadata: ArgumentMetadata) {
        if (!this.type || typeof(value) !== "object" || value["role"]) return value; 

        const keys = Object.keys(plainToInstance(this.type, {}))
       
        Object.keys(value).forEach(elem => {
            if (!keys.includes(elem)) throw new BadRequestException(`Plant ${elem} is not in dto`)
        }) 

        return value
    }

    public setType<T>(type: T) {
        this.type = type 
        return this
    }
}