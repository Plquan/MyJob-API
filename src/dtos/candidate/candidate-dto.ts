import { EGender, EMartialStatus } from "@/common/enums/candidate/candidate-enum"

export interface ICandidateData {
  provinceId?: number
  phone?: string
  birthday?: Date
  gender?: EGender
  maritalStatus?: EMartialStatus
  address?: string
}


export interface ICandidateDto {
  id: number;
  userId: number;
  provinceId?: number;
  fullName: string;
  phone?: string;
  birthday?: string | Date;
  gender?: EGender;
  maritalStatus?: EMartialStatus;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
