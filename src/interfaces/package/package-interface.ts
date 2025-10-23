import { IResponseBase } from "../base/IResponseBase"
import { ICreatePackageRequest, IPackageDto, IUpdatePackageRequest } from "./package-dto"

export default interface IPackageService {
    getPackages(): Promise<IPackageDto[]>
    getAllPackages(): Promise<IPackageDto[]>
    createPackage(data: ICreatePackageRequest):Promise<IPackageDto>
    updatePackage(data: IUpdatePackageRequest):Promise<IPackageDto>
    deletePackage(packageId: number): Promise<boolean>
    purchasePackage(packageId: number): Promise<IResponseBase>
}