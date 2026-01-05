import { ILanguageDto } from "@/dtos/language/language-dto";
import { ICreateLanguageData, IUpdateLanguageData } from "./language-dto";

export default interface ILanguageService {
    getAllLanguages(): Promise<ILanguageDto[]>
    createLanguage(data: ICreateLanguageData): Promise<ILanguageDto>
    updateLanguage(data: IUpdateLanguageData): Promise<ILanguageDto>
    deleteLanguage(languageId: number): Promise<boolean>
}