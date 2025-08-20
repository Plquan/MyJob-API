export interface ICreateEducationData {
  resumeId: number
  degreeName: string
  major: string
  trainingPlace: string
  startDate: Date 
  completedDate?: Date 
  description?: string
}

export interface IUpdateEducationData {
  id: number
  degreeName: string
  major: string
  trainingPlace: string
  startDate: Date 
  completedDate?: Date 
  description?: string
}