export interface IUploadAttachedResumeData {
    provinceId:number
    careerId:number
    candidateId?: number
    myJobFileId?: number
    title?: string;
    description?: string
    salaryMin?: number
    salaryMax?: number
    position?: number
    typeOfWorkPlace?: number
    experience?: number
    academicLevel?: number
    jobType?: number
    type?:string
  }

  
export interface IUpdateAttachedResumeData {
    id: number
    provinceId:number
    careerId:number
    title?: string;
    description?: string
    salaryMin?: number
    salaryMax?: number
    position?: number
    typeOfWorkPlace?: number
    experience?: number
    academicLevel?: number
    jobType?: number
  }
  
  