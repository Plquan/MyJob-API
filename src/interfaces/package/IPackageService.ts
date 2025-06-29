import { IResponseBase } from "../base/IResponseBase"
import { ICreatePackageData, IPackageFeatureData, IUpdatePackageData } from "./PackageDto"

export default interface IPackageService {
    getAllPackageTypes(): Promise<IResponseBase>
    getAllFeatures(): Promise<IResponseBase>
    getAllPackages(): Promise<IResponseBase>
    createPackage(data: ICreatePackageData):Promise<IResponseBase>
    updatePackage(data: IUpdatePackageData):Promise<IResponseBase>
    deletePackage(packageId: number): Promise<IResponseBase>
    getFeaturesOfPackage(packageId: number): Promise<IResponseBase>
    updatePackageFeature(data: IPackageFeatureData[],packageId: number): Promise<IResponseBase>
}