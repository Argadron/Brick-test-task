import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { JwtUser } from "../interfaces";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request: Request = context.switchToHttp().getRequest()
            const user = this.jwtService.verify<JwtUser>(ExtractJwt.fromAuthHeaderAsBearerToken()(request))

            if (!user) throw new UnauthorizedException();

            const roles: string[] = this.reflector.get("ROLES", context.getHandler())

            return roles.includes(user.role) ? true : false
        } catch(e) {
            throw new UnauthorizedException()
        }   
    }
}