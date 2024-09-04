import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import logger from '@helpers/logger'
import { Observable, tap } from "rxjs";

@Injectable()
export class DebugLogger implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        logger.before(context, true)

        return next.handle().pipe(tap((data: unknown) => {
            logger.after(context, data)
        }))
    }
}