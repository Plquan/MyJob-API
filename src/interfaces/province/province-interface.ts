import { Province } from "@/entities/province";

export default interface IProvinceService {
    getAllProvinces(): Promise<Province[]>
}