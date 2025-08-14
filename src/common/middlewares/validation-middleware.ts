import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorMessages } from '@/common/constants/ErrorMessages';
import HttpException from '@/errors/http-exception';


function validationMiddleware(
    type: any, 
    skipMissingProperties = false, 
    requireFile = false,
    fromForm = false
): RequestHandler {
    return (req, res, next) => {
        let parsedBody: any;

        try {
            if (fromForm) {
                if (typeof req.body?.data !== 'string') {
                    const error = new HttpException(StatusCodes.BAD_REQUEST, '"data" field is required in form-data');
                     res.status(StatusCodes.BAD_REQUEST).json(error.getError());
                   return
                }
                parsedBody = JSON.parse(req.body.data);
            } else {
                parsedBody = req.body;
            }
        } catch (err) {
            const error = new HttpException(StatusCodes.BAD_REQUEST, 'Invalid JSON format in request body or "data"');
             res.status(StatusCodes.BAD_REQUEST).json(error.getError());
             return
        }

        if (!parsedBody) {
            const error = new HttpException(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_REQUEST_BODY);
             res.status(StatusCodes.BAD_REQUEST).json(error.getError());
             return
        }

        if (requireFile && !req.file) {
            const error = new HttpException(StatusCodes.BAD_REQUEST, 'File is required but missing');
             res.status(StatusCodes.BAD_REQUEST).json(error.getError());
             return
        }

        validate(plainToInstance(type, parsedBody), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const errorMessages = errors.map((error: ValidationError) => error.constraints);
                    const error = new HttpException(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_REQUEST_BODY, errorMessages);
                     res.status(StatusCodes.BAD_REQUEST).json(error.getError());
                     return
                }

                req.body = parsedBody;
                next();
            });
    };
}

export default validationMiddleware;