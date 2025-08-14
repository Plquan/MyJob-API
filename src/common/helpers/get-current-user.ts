import { RequestStorage } from "@/common/middlewares/async-local-storage"
import { StatusCodes } from "http-status-codes"
import { LocalStorage } from "../constants/local-storage"
import { ICurrentUser } from "@/dtos/auth/auth-dto"
import HttpException from "@/errors/http-exception"
import { ErrorMessages } from "../constants/ErrorMessages"

export function getCurrentUser(): ICurrentUser {
  const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE)
  const currentUser = request?.user

  if (!currentUser) {
     throw new HttpException(StatusCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
  }

  return currentUser
}
