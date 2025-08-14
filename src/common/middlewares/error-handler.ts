
import HttpException from '@/errors/http-exception';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof HttpException) {
    const { statusCode, errorMessage, errors } = err.getError();
    res.status(statusCode).json({
      message: errorMessage,
      error: err.name,
      errors,
    });
  } else {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.name || 'Error',
    });
  }
  console.error(err); 
}
