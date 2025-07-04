import { IResponseBase } from "../base/IResponseBase"
import { IResumeData } from "../candidate/CandidateDto"
import { IUpdateAttachedResumeData, IUploadAttachedResumeData } from "./ResumeDto"

export default interface IResumeService {
   getOnlineResume(): Promise<IResponseBase>
   updateOnlineResume(data: IResumeData):Promise<IResponseBase>
   getAllAttachedResumes(): Promise<IResponseBase>
   getAttachedResumeById(attchedResumeId: number): Promise<IResponseBase>
   uploadAttachedResume(data: IUploadAttachedResumeData,file: Express.Multer.File): Promise<IResponseBase>
   updateAttachedResume(data: IUpdateAttachedResumeData,file: Express.Multer.File): Promise<IResponseBase>
   deleteAttachedResume(attchedResumeId: number): Promise<IResponseBase>
   setSelectedResume(resumeId: number): Promise<IResponseBase>
}
