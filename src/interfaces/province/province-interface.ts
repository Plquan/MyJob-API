import { Province } from "@/entities/province";
import { District } from "@/entities/district";

export default interface IProvinceService {
    getAllProvinces(): Promise<Province[]>
    getDistrictsByProvince(provinceId:number):Promise<District[]>
}