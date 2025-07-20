import { ICandidateRegisterData, ICompanyRegisterData, ICurrentUser, ILoginData, IUserLoginResponse } from "@/interfaces/auth/AuthDto";
import IAuthService from "@/interfaces/auth/IAuthService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/DatabaseService";
import { StatusCodes } from "http-status-codes";
import Extensions from "@/ultils/Extensions";
import logger from "@/helpers/logger";
import ICompanyService from "@/interfaces/company/ICompanyService";
import { LocalStorage } from "@/constants/LocalStorage";
import { VariableSystem } from "@/constants/VariableSystem";
import ICandidateService from "@/interfaces/candidate/ICandidateService";
import { IJwtService, ITokenPayload } from "@/interfaces/auth/IJwtService";
import { RequestStorage } from "@/middlewares/AsyncLocalStorage";



export default class AuthService implements IAuthService {
    private readonly _jwtService: IJwtService
    private readonly _context: DatabaseService
    private readonly _candidateService: ICandidateService
    private readonly _companyService: ICompanyService

    constructor(JwtService: IJwtService, CandidateService:ICandidateService, DatabaseService: DatabaseService, CompanyService:ICompanyService) {
      this._jwtService = JwtService;
      this._candidateService = CandidateService;
      this._context = DatabaseService;
      this._companyService = CompanyService
    }
    
    async refreshToken(oldRefreshToken: string, setTokensToCookie: (newAccessToken: string, newRefreshToken: string) => void): Promise<IResponseBase> {
     try {
     const isValid = this._jwtService.verifyRefreshToken(oldRefreshToken);    
     const payload = this._jwtService.getTokenPayload(oldRefreshToken);

     if(!payload.tokenId || !payload.userId || !isValid)
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message:"Token không hợp lệ",
        }
         const tokenPayload: ITokenPayload = {
            userId: payload.userId,
            fullName: payload.fullName,
            roleName: payload.roleName,
            isStaff: payload.isStaff,
            isSuperUser: payload.isSuperUser
          
          };
        
         const accessToken = this._jwtService.generateAccessToken(tokenPayload)
          const refreshToken = this._jwtService.generateRefreshToken(tokenPayload)

           const userRefreshToken = {
            id:refreshToken.tokenId,
            userId:payload.userId,
            revoked:false,
            token:refreshToken.token,
            expiresAt:refreshToken.expiresAtUtc
          }
          await this._context.RefreshTokenRepo.delete({ id: payload.tokenId });
          await this._context.RefreshTokenRepo.save(userRefreshToken)
          setTokensToCookie(accessToken.token,refreshToken.token)

           return {
            status: StatusCodes.ACCEPTED,
            success: true,
          }
     
     } catch (error) {
          logger.error(error?.message);
            console.log(`Error in AuthService - method refreshToken at ${new Date().getTime()} with message ${error?.message}`);
            return {
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              success: false,
              message: "Lỗi hệ thống, vui lòng thử lại sau",
            }
        }
    }
    async candidateLogin(userLogin: ILoginData, setTokensToCookie: (accessToken: string, refreshToken: string) => void): Promise<IResponseBase> {
       try {
          if (!userLogin.email || !userLogin.password) {
            return {
              status: StatusCodes.BAD_REQUEST,
              success: false,
              message: "Thông tin không được để trống"
            }
          }

          const user = await this._context.UserRepo.findOne({
            where: { email: userLogin.email , roleName:VariableSystem.ROLE_NAME.CANDIDATE}, 
          })

            if(!user){
              return {
                  status: StatusCodes.NOT_FOUND,
                  success: false,
                  message: "Không tìm thấy tài khoản",
                }
            }

        const checkPass = await Extensions.comparePassword(userLogin.password, user.password);
          if (!checkPass) {
            return {
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Mật khẩu không chính xác",
            }
          }

          if (!user.isActive) {
            return {
              status: StatusCodes.FORBIDDEN,
              success: false,
              message: "Tài khoản của bạn đã bị khóa",
            }
          }

          const tokenPayload: ITokenPayload = {
            userId: user.id,
            fullName: user.fullName,
            roleName: user.roleName,
            isStaff: user.isStaff,
            isSuperUser: user.isSuperUser
          }
          
          const accessToken = this._jwtService.generateAccessToken(tokenPayload)
          const refreshToken = this._jwtService.generateRefreshToken(tokenPayload)
          const userRefreshToken = {
            id:refreshToken.tokenId,
            userId:user.id,
            revoked:false,
            token:refreshToken.token,
            expiresAt:refreshToken.expiresAtUtc
          }
          await this._context.RefreshTokenRepo.save(userRefreshToken)
          setTokensToCookie(accessToken.token,refreshToken.token)              
          return {
            status: 200,
            success: true,
            message:"Đăng nhập thành công"
          }

          } catch (error) {
            logger.error(error?.message);
            console.log(`Error in AuthService - method login at ${new Date().getTime()} with message ${error?.message}`);
            return {
              status: 500,
              success: false,
              message: "Lỗi hệ thống, vui lòng thử lại sau"
            }
          }
    }
    async companyLogin(userLogin: ILoginData,setTokensToCookie: (accessToken: string, refreshToken: string) => void): Promise<IResponseBase> {
        try {
            if (!userLogin.email || !userLogin.password) {
              return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Tài khoản và mật khẩu không được để trống",
              }
            }
            const user = await this._context.UserRepo.findOne({
              where: { email: userLogin.email, roleName:VariableSystem.ROLE_NAME.EMPLOYER },
            })

            if(!user){
              return {
                  status: StatusCodes.NOT_FOUND,
                  success: false,
                  message: "Tài khoản không tồn tại",
                }
            }
          const checkPass = await Extensions.comparePassword(userLogin.password, user.password);
            if (!checkPass) {
              return {
                status: StatusCodes.UNAUTHORIZED,
                success: false,
                message: "Mật khẩu không chính xác",
              }
            }
          if (!user.isActive) {
            return {
              status: StatusCodes.FORBIDDEN,
              success: false,
              message: "Tài khoản của bạn đã bị khóa",
            }
          }
    
          const tokenPayload: ITokenPayload = {
            userId: user.id,
            fullName: user.fullName,
            roleName: user.roleName,
            isStaff: user.isStaff,
            isSuperUser: user.isSuperUser
          };

          const accessToken = this._jwtService.generateAccessToken(tokenPayload)
          const refreshToken = this._jwtService.generateRefreshToken(tokenPayload)
           const userRefreshToken = {
            id:refreshToken.tokenId,
            userId:user.id,
            revoked:false,
            token:refreshToken.token,
            expiresAt:refreshToken.expiresAtUtc
          }
          await this._context.RefreshTokenRepo.save(userRefreshToken)
          setTokensToCookie(accessToken.token,refreshToken.token)
           
          return {
            status: 200,
            success: true,
            message:"Đăng nhập thành công",
          };

          } catch (error) {
            logger.error(error?.message);
            console.log(`Error in AuthService - method login() at ${new Date().getTime} with message ${error?.message}`);
            return {
              status: 500,
              success: false,
              message: "Lỗi máy chủ, vui lòng thử lại sau"
            }
          }
    }
    async candidateRegister(candidateRegister: ICandidateRegisterData): Promise<IResponseBase> {
      if (!candidateRegister.email || !candidateRegister.fullName || !candidateRegister.password) {
        return {
          status: StatusCodes.BAD_REQUEST,
          success: false,
          message:"Thông tin đăng ký chưa đầy đủ",
        }
      }

      const checkEmail = await this._context.UserRepo.count({
        where: { email: candidateRegister.email },
      });

      if (checkEmail) {
        return {
          status: StatusCodes.CONFLICT,
          success: false,
          message: "Email đã tồn tại",
        }
      }
        const dataSource = this._context.getDataSource()
        try {
          await dataSource.transaction(async (manager) => {
            const hashPassword = Extensions.hashPassword(candidateRegister.password)

            const newUser = await manager.save(this._context.UserRepo.create({
              email: candidateRegister.email,
              fullName: candidateRegister.fullName,
              password: hashPassword,
              isActive: true,
              roleName: VariableSystem.ROLE_NAME.CANDIDATE,
            }))

            const profileResult = await this._candidateService.createProfile(newUser, manager)
            if (!profileResult.success) {
                throw new Error(profileResult.message)
              }
          })

        return {
          status: StatusCodes.CREATED,
          success: true,
          message: "Đăng kí tài khoản thành công",
        }
      } catch (error: any) {
        logger.error(error?.message);
        console.log(`Error in AuthService - candidateRegister transaction: ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi máy chủ, vui lòng thử lại sau"
        }
      }
    }
    async companyRegister(companyRegister: ICompanyRegisterData): Promise<IResponseBase> {
      try {
            if(!companyRegister.email || !companyRegister.fullName || !companyRegister.password) {
              return {
                  status: StatusCodes.BAD_REQUEST,
                  success: false,
                  message: "Thông tin đăng ký chưa đầy đủ",
                }
            }

            const checkEmail = await this._context.UserRepo.count({
              where: { email: companyRegister.email }
            })

            if(checkEmail){
              return {
                  status: StatusCodes.CONFLICT,
                  success: false,
                  message: "Email đã tồn tại",
                  data: null
                }
            }     
          
            const hashPassword = Extensions.hashPassword(companyRegister.password);

            const registerData = {
              email: companyRegister.email,
              fullName: companyRegister.fullName,
              password: hashPassword,
              isActive:true,
              roleName: VariableSystem.ROLE_NAME.EMPLOYER,
            }
            const newUser = await this._context.UserRepo.save(registerData);

            if (!newUser) {
              return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Đăng kí tài khoản không thành công, vui lòng kiểm tra lại",
              }
            }
            companyRegister.companyInfo.userId = newUser.id
            if(companyRegister.companyInfo){
                const result =  await this._companyService.createCompanyInfo(companyRegister.companyInfo)
                if(!result.success){
                  return {
                    status: result.status,
                    success: false,
                    message: result.message,
                  }
                }
            }
            return {
              status: StatusCodes.CREATED,
              success: true,
              message: "Đăng kí tài khoản thành công",
            }
          } catch (error:any) {
              logger.error(error?.message);
              console.log(`Error in AuthService - method register at ${new Date().getTime()} with message ${error?.message}`);
              return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Có lỗi xảy ra khi tạo tài khoản nhà tuyền dụng, vui lòng thử lại sau",
              };
        }
    } 
    async getMe(): Promise<IResponseBase> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user.id;
        if (!userId) {
            return {
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Bạn không có quyền truy cập",
            };
          }

        const user = await this._context.UserRepo.findOne({
          where: {
            id: userId, 
          },
          relations: {
            candidate: true,
            avatar: true,
          },
        })

        const currentUser = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          roleName: user.roleName,
          isStaff: user.isStaff,
          isActive: user.isActive,
          allowSearch: user.candidate?.allowSearch ?? true,
          avatar: user.avatar?.url
        }

          if (!user) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy thông tin người dùng",
            data: user
          };
        }

        return {
        status: StatusCodes.OK,
        success: true,
        data: currentUser,
      };

      } catch (error:any) {
        logger.error(error?.message);
        console.log(`Error in AuthService - method getMe() at ${new Date().getTime} with message ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Có lỗi xảy ra khi lấy thông tin tài khoản, vui lòng thử lại sau",
        }
      }
    }  
}