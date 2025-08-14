export interface ICreatePackageData {
    name: string
    description?: string
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
  quota?: number
  description?: string
}

