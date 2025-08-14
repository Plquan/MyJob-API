import { IResponseBase } from "../base/IResponseBase"
import { ICreatePackageData, IPackageFeatureData, IUpdatePackageData } from "../../dtos/package/package-dto"

export default interface IPackageService {
    getAllPackages(): Promise<IResponseBase>
    createPackage(data: ICreatePackageData):Promise<IResponseBase>
    updatePackage(data: IUpdatePackageData):Promise<IResponseBase>
    deletePackage(packageId: number): Promise<IResponseBase>
    getPackageFeatures(packageId: number): Promise<IResponseBase>
    updatePackageFeatures(data: IPackageFeatureData[],packageId: number): Promise<IResponseBase>
    getAllPackagesWithFeatures(): Promise<IResponseBase>
    purchasePackage(packageId: number): Promise<IResponseBase>
}