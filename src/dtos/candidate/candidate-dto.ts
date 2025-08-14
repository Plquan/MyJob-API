import { EGender, EMartialStatus } from "@/common/enums/candidate/candidate-enum"

export interface ICandidateData {
    provinceId?: number
    districtId?:number
    phone?: string
    birthday?: Date
    gender?: EGender
    maritalStatus?: EMartialStatus
    address?: string
  }
