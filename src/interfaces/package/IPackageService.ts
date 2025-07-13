import { IResponseBase } from "../base/IResponseBase"
import { ICreatePackageData, IPackageFeatureData, IUpdatePackageData } from "./PackageDto"

export default interface IPackageService {
    getAllFeatures(): Promise<IResponseBase>
    getAllPackages(): Promise<IResponseBase>
    createPackage(data: ICreatePackageData):Promise<IResponseBase>
    updatePackage(data: IUpdatePackageData):Promise<IResponseBase>
    deletePackage(packageId: number): Promise<IResponseBase>
    getPackageFeatures(packageId: number): Promise<IResponseBase>
    updatePackageFeatures(data: IPackageFeatureData[],packageId: number): Promise<IResponseBase>
}