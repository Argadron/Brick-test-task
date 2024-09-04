import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException} from "@nestjs/common";
import logger from "@helpers/logger";
import { Response } from "express";

@Catch(Error, InternalServerErrorException)
export class InternalExceptionsFilter implements ExceptionFilter {
    catch(exception: Error | InternalServerErrorException, host: ArgumentsHost) {
        const response: Response = host.switchToHttp().getResponse()

        if (exception instanceof HttpException && !(exception instanceof InternalServerErrorException)) return response.status(exception.getStatus()).json(exception.getResponse());

        logger.error(exception, host)

        response.status(500).json({ message: exception.name ? exception.name : "Internal Server Error", 
            error: "Internal Server Error" })
    }
}