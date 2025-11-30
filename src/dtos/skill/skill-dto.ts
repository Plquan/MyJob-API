export interface ICreateSkillData {
    resumeId: number
    name: string
    level: number
}

export interface IUpdateSkillData {
    id: number
    name: string
    level: number
}

export interface ISkillDto {
  id: number
  resumeId: number
  name: string
  level: number
  createdAt: Date
  updatedAt: Date
}
