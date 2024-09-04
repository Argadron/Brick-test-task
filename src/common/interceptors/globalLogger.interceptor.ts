import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import logger from '@helpers/logger'
import { Observable } from "rxjs";

@Injectable()
export class GlobalLogger implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        logger.before(context, false)

        return next.handle()
    }
}