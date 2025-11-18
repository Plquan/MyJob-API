import { HttpException } from "@/errors/http-exception";
import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../constants/ErrorMessages";
import logger from "../helpers/logger";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error(`[${new Date().toISOString()}] Error in ${request.method} ${request.url}:`, error.message);
  logger.error(`Error in ${request.method} ${request.url}: ${error.message}`);
  const status = error.status ?? 500;
  const message = status === 500 ? ErrorMessages.INTERNAL_SERVER_ERROR : error.message;
  const errorCode = error.errorCode;
  response.status(status).send({ message, errorCode: errorCode });
}

export default errorMiddleware;
