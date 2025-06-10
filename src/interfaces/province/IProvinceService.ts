import { IResponseBase } from "../base/IResponseBase";

export default interface IProvinceService {
    getAllProvinces(): Promise<IResponseBase>
}