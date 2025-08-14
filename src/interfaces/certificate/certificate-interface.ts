import { IResponseBase } from "../base/IResponseBase";
import { ICreateCertificateData, IUpdateCertificateData } from "../../dtos/certificate/certificate-dto";


export default interface ICertificateService {
    getAllCertificates():Promise<IResponseBase>
    createCertificate(data: ICreateCertificateData): Promise<IResponseBase>
    updateCertificate(data: IUpdateCertificateData): Promise<IResponseBase>
    deleteCertificate(id: number): Promise<IResponseBase>
}