export interface ICreatePackageData {
    name: string
    description?: string
    packageTypeId: number
    price: number;
    durationInDays?: number;
    isActive?: boolean;
}

export interface IUpdatePackageData {
    id?: number
    name: string
    description?: string
    price: number;
    durationInDays?: number;
    isActive?: boolean;
}

export interface IPackageFeatureData {
  featureId: number
  packageId: number
  unlimited?: boolean
  limit?: number
  description?: string
}

export interface IUpdatePackageFeatureData {
    id: number
    open:boolean
    name: string
    haslimit:boolean
    limit:number
    description: string
    packageTypeId: number
}
