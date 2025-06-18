export interface ICreateExperienceData {
    jobName: string
    companyName: string
    startDate: Date
    endDate: Date
    description?: string
}

export interface IUpdateExperienceData {
    id: number
    jobName: string
    companyName: string
    startDate: Date
    endDate: Date
    description?: string
}