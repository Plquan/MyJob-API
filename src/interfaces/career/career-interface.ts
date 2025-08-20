import { IResponseBase } from "../base/IResponseBase";


export default interface ICareerService {
    getAllCareers():Promise<IResponseBase>
}