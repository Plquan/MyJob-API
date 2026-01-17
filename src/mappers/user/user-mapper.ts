import { User } from "@/entities/user";
import { IUserDto } from "@/interfaces/user/user-dto";
export default class UserMapper {
    public static toUserDto(data: User): IUserDto {
        return {
            id: data.id,
            email: data.email,
            isVerifyEmail: data.isVerifyEmail,
            isActive: data.isActive,
            isSuperUser: data.isSuperUser,
            isStaff: data.isStaff,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
    }
}
