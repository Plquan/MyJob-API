import { UpdateAttachedResumeRequest } from "../../dtos/resume/update-attached-resume-request"
import { UpdateOnlineResumeRequest } from "../../dtos/resume/update-online-resume-request"
import { UploadAttachedResumeRequest } from "../../dtos/resume/upload-attached-resume-request"
import { IOnlineResumeDto, IResumeDto, ISearchResumesReqParams } from "@/dtos/resume/resume-dto"
import { IPaginationResponse } from "../base/IPaginationBase"

export default interface IResumeService {
   getOnlineResume(): Promise<IOnlineResumeDto>
   updateOnlineResume(data: UpdateOnlineResumeRequest): Promise<IResumeDto>
   getResumes(): Promise<IResumeDto[]>
   getResumeById(attchedResumeId: number): Promise<IResumeDto>
   createResume(data: UploadAttachedResumeRequest, file: Express.Multer.File, candidateId: number): Promise<IResumeDto>
   updateAttachedResume(data: UpdateAttachedResumeRequest, file: Express.Multer.File): Promise<IResumeDto>
   deleteResume(attchedResumeId: number): Promise<boolean>
   setSelectedResume(resumeId: number): Promise<boolean>
   searchResumes(params: ISearchResumesReqParams): Promise<IPaginationResponse<IResumeDto>>
   getResumeForDownload(resumeId: number): Promise<IOnlineResumeDto>
   getResumeDetail(resumeId: number): Promise<IResumeDto>
   toggleSaveResume(resumeId: number): Promise<boolean>
   getSavedResumes(params: ISearchResumesReqParams): Promise<IPaginationResponse<IResumeDto>>
}
