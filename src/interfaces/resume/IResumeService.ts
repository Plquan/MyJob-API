import { IResponseBase } from "../base/IResponseBase"
import { IResumeData } from "../candidate/CandidateDto"

export default interface IResumeService {
   getOnlineResume(): Promise<IResponseBase>
   updateOnlineResume(data: IResumeData):Promise<IResponseBase>
}
