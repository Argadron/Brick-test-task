import { ArgumentsHost, ExecutionContext, InternalServerErrorException, Logger } from "@nestjs/common";
import { Request, Response } from 'express'

class LoggerHelper {
    private createDate() {
        const time = new Date() 
        const hours = time.getUTCHours() + 5 
        let mins: any = time.getUTCMinutes() 

        if (mins < 10) {
            mins = `0${mins}`
        }

        return {
            hours, mins
        }
    }

    before(ctx: ExecutionContext, debugMode: boolean) {
        const { hours, mins } = this.createDate()
      
        const request: Request = ctx.switchToHttp().getRequest()

        const type = request.method
        const url = request.url
        const body = JSON.stringify(request.body) || null 
      
        const log = `[${hours}:${mins}] [${type ? type : "TELEGRAM"}] [${url ? url : "TELEGRAM"}] request Body: ${debugMode ? body : body?.length > 2 ? true: false}\n` 
      
        Logger.log(log)
    }

    after(ctx: ExecutionContext, data: unknown) {
        const response: Response = ctx.switchToHttp().getResponse()

        const { hours, mins } = this.createDate()

        const status = response.statusCode
        
        typeof(data) === "object" ? data = JSON.stringify(data) : null
        
        const log = `[${status}] [${hours}:${mins}] response body: ${data}`

        Logger.debug(log)
    }

    error(exception: any, host: ArgumentsHost) {
        const { hours, mins } = this.createDate()

        let error: string;

        if (exception satisfies Error && !(exception instanceof InternalServerErrorException)) {
            const request: Request = host.switchToHttp().getRequest()

            const body = JSON.stringify(request.body)

            error = `[Internal] [${hours}:${mins}] [${request.method}] Untracked error in processing user request by url: ${request.url} \n request body: ${body}`
        }
        else {
            const request: Request = host.switchToHttp().getRequest()

            const body = JSON.stringify(request.body)

            error = `[500] [${hours}:${mins}] [${request.method}] error in processing user request by url ${request.url} \n body: ${body} `
        }

        Logger.error(error, exception.stack)
    }
}

export default new LoggerHelper()