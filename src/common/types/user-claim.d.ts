import { EUserRole } from "../enums/user/user-role-enum";

type UserClaim = {
  id: number;
  fullName: string;
  roleName: EUserRole;
  function: string[]
  isSuperUser:boolean
  accessToken: string;
  companyId: number
  candidateId: number
};
