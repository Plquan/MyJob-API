import { ICareerData } from "../../dtos/career/carreer-dto";


export default interface ICareerService {
    getAllCareers():Promise<ICareerData[]>
}