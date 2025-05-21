export interface ICompanyData {
  id: number;
  provinceId: number;
  userId: number;
  companyName: string;
  slug: string;
  companyEmail: string;
  companyPhone: string;
  websiteUrl?: string;
  taxCode: string;
  since?: Date;
  fieldOperation?: string;
  description?: string;
  employeeSize?: number;
  address:string
}