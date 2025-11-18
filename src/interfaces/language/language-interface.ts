import { IResponseBase } from "../base/IResponseBase";
import { ICreateLanguageData, IUpdateLanguageData } from "./language-dto";

export default interface ILanguageService {
    getAllLanguages(): Promise<IResponseBase>
    createLanguage(data: ICreateLanguageData): Promise<IResponseBase>
    updateLanguage(data: IUpdateLanguageData): Promise<IResponseBase>
    deleteLanguage(languageId: number): Promise<IResponseBase>
}