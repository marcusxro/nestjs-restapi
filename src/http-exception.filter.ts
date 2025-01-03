import {
    Catch, ArgumentsHost,
    HttpStatus, HttpException
} from "@nestjs/common";

import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import { LoggerService } from "./logger/logger.service";
import { QueryFailedError } from 'typeorm';

interface ResponseOBJ {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
    response: string | object;
}

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    constructor(private readonly logger: LoggerService) {
        super();
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse()['message'] || exception.message;
        } else if (exception instanceof QueryFailedError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Database query failed';
        }

        const errorResponse: ResponseOBJ = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
            response: response.statusMessage,
        };

        this.logger.error(
            `[${request.method}] ${request.url} - ${status} - ${message}`,
        );

        if (!response.headersSent) {
            response.status(status).json(errorResponse);
        }
    }
}