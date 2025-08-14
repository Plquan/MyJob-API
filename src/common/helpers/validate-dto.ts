import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import HttpException from '@/errors/http-exception';
import { ErrorMessages } from '../constants/ErrorMessages';

export async function validateDto<T extends object>(dtoInstance: T, skipMissingProperties = false): Promise<void> {
    const errors: ValidationError[] = await validate(dtoInstance, { skipMissingProperties });

    if (errors.length > 0) {
        const errorMessages = errors.map((error) => error.constraints);
        throw new HttpException(
            StatusCodes.BAD_REQUEST,
            ErrorMessages.INVALID_REQUEST_BODY,
            errorMessages
        )
    }
}

