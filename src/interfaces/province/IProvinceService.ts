import { IResponseBase } from "../base/IResponseBase";
import { IProvinceData } from "./ProvinceDto";

export default interface IProvinceService {
    getAllProvinces(): Promise<IResponseBase>
}