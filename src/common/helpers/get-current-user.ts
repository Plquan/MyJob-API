import { RequestStorage } from "@/common/middlewares/async-local-storage"
import { StatusCodes } from "http-status-codes"
import { LocalStorage } from "../constants/local-storage"
import { ErrorMessages } from "../constants/ErrorMessages"
import { HttpException } from "@/errors/http-exception"

export function getCurrentUser(): UserClaim {
  const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE)
  const currentUser = request?.user
  if (!currentUser) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
  }
  return currentUser
}
