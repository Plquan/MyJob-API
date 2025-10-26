import { RequestStorage } from "@/common/middlewares/async-local-storage"
import { LocalStorage } from "../constants/local-storage"
import { UserClaim } from "../types/user-claim"

export function getCurrentUser(): UserClaim {
  const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE)
  const currentUser = request?.user
  return currentUser
}
