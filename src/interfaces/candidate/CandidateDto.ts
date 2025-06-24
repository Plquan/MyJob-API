export interface ICandidateData {
    provinceId?: number
    districtId?:number
    phone?: string
    birthday?: Date
    gender?: string
    maritalStatus?: string
    address?: string
  }

 export interface IResumeData {
    id: number
    candidateId: number
    myJobFileId?: number
    title?: string;
    description?: string
    salary_min?: number
    salary_max?: number
    position?: number
    typeOfWorkPlace?: number
    experience?: number
    academicLevel?: number
    jobType?: number
    type?: string
    isActive: boolean
  }