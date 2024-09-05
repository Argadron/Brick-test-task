import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

/**
 * This pipe validate optional plants.
 * Example: Missing name or email. Type: new OptionalValidatorPipe().check(["name", "email"])
 * If name and email is null, throw BadRequest error
 */
@Injectable()
export class OptionalValidatorPipe implements PipeTransform {
    private plants: string[] = [];

    transform(value: any, metadata: ArgumentMetadata) {
        if (this.plants.length < 2) throw new Error("Optional Validator: Must 2 plants to use pipe")

        let check = false;

        for (let i in value) {
            if (value[i] === "" || !value) continue

            if (this.plants.includes(i)) check = true
        }

        value === undefined ? check = true : null

        if (!check && !value?.role) throw new BadRequestException(`One of optional plants must be writed: ${this.plants}`)

        return value
    }

    public check(plants: string[]) {
        this.plants = plants
        return this
    }
}