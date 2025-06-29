export interface ICreatePackageData {
    name: string
    description?: string
    packageTypeId: number
}

export interface IUpdatePackageData {
    id?: number
    name: string
    description?: string
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
