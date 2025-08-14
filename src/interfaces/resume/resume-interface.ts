import { IResponseBase } from "../base/IResponseBase"
import { UpdateAttachedResumeRequest } from "../../dtos/resume/update-attached-resume-request"
import { UpdateOnlineResumeRequest } from "../../dtos/resume/update-online-resume-request"
import { UploadAttachedResumeRequest } from "../../dtos/resume/upload-attached-resume-request"

export default interface IResumeService {
   getOnlineResume(): Promise<IResponseBase>
   updateOnlineResume(data: UpdateOnlineResumeRequest):Promise<IResponseBase>
   getAllAttachedResumes(): Promise<IResponseBase>
   getAttachedResumeById(attchedResumeId: number): Promise<IResponseBase>
   uploadAttachedResume(data: UploadAttachedResumeRequest,file: Express.Multer.File): Promise<IResponseBase>
   updateAttachedResume(data: UpdateAttachedResumeRequest,file: Express.Multer.File): Promise<IResponseBase>
   deleteAttachedResume(attchedResumeId: number): Promise<IResponseBase>
   setSelectedResume(resumeId: number): Promise<IResponseBase>
}
