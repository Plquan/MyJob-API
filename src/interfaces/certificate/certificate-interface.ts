import { ICreateCertificateData, IUpdateCertificateData, ICertificateDto } from "../../dtos/certificate/certificate-dto";


export default interface ICertificateService {
    getAllCertificates():Promise<ICertificateDto[]>
    createCertificate(data: ICreateCertificateData): Promise<ICertificateDto>
    updateCertificate(data: IUpdateCertificateData): Promise<ICertificateDto>
    deleteCertificate(id: number): Promise<boolean>
}