import { HttpException } from "@/errors/http-exception";
import { NextFunction, Request, Response } from "express";
import { ErrorMessages } from "../constants/ErrorMessages";

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status ? error.status : 500;
  const message = status === 500 ? ErrorMessages.INTERNAL_SERVER_ERROR : error.message;
  const errorCode = error.errorCode;
  response.status(status).send({ message, error: errorCode });
}

export default errorMiddleware;