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