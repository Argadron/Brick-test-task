import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtUser } from "../interfaces";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly jwtService: JwtService,
                private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("JWT_SECRET")
        })
    }

    async validate(payload: JwtUser) {
        return payload
    }
}