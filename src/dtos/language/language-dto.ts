export interface ICreateLanguageData {
  resumeId: number;
  language: number;
  level: number;
}

export interface IUpdateLanguageData {
  id: number;
  language: number;
  level: number;
}

export interface ILanguageDto {
  id: number;
  resumeId: number;
  language: number;   
  level: number; 
  createdAt: Date;
  updatedAt: Date;
}
