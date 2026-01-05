import { EGender, EMartialStatus } from "@/common/enums/candidate/candidate-enum"
import { IMyJobFileDto } from "@/interfaces/myjobfile/myjobfile-dto"

export interface ICandidateData {
  fullName?:string 
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
  birthday?: Date;
  gender?: EGender;
  maritalStatus?: EMartialStatus;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?:IMyJobFileDto
}
