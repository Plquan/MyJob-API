export interface IUser {
  id: number;
  avatarId?: number;
  email: string;
  fullName: string;
  password: string;
  isVerifyEmail: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isSuperUser: boolean;
  isStaff: boolean;
  roleName?: string;
  createdAt: Date;
  updatedAt: Date;
}

