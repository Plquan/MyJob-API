export interface ICreateCertificateData {
    resumeId: number
    name: string
    trainingPlace: string
    startDate: Date
    expirationDate?: Date 
}

export interface IUpdateCertificateData {
    id: number
    name: string
    trainingPlace: string
    startDate: Date
    expirationDate?: Date 
}

export interface ICertificateDto {
  id: number
  resumeId: number
  name: string
  trainingPlace: string
  startDate: Date
  expirationDate?: Date
  createdAt: Date
  updatedAt: Date
}
