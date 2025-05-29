import { ICandidateRegisterData, ICompanyRegisterData, ILoginData, IUserLoginResponse } from "@/interfaces/auth/AuthDto";
import IAuthService from "@/interfaces/auth/IAuthService";
import { ITokenPayload, IJWTService, IRefreshToken } from "@/interfaces/auth/IJwtService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/DatabaseService";
import { StatusCodes } from "http-status-codes";
import Extensions from "@/ultils/Extensions";
import logger from "@/helpers/logger";
import IRoleService from "@/interfaces/auth/IRoleService";
import ICompanyService from "@/interfaces/company/ICompanyService";
import { RequestStorage } from "@/middlewares/AsyncLocalStorage";
import { LocalStorage } from "@/constants/LocalStorage";
import { VariableSystem } from "@/constants/VariableSystem";


export default class AuthService implements IAuthService {
    private readonly _jwtService: IJWTService
    private readonly _context: DatabaseService
    private readonly _roleService: IRoleService
    private readonly _companyService: ICompanyService

    constructor(JwtService: IJWTService, RoleService: IRoleService, DatabaseService: DatabaseService, CompanyService:ICompanyService) {
      this._jwtService = JwtService;
      this._roleService = RoleService;
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
            data: null,
            error: {
              message: "ErrorMessages.UNAUTHORIZED",
              errorDetail: "Token không hợp lệ",
            }, 
        }
         const tokenPayload: ITokenPayload = {
            userId: payload.userId,
            userName: payload.userName,
            role: payload.role,
            roleName: payload.roleName,
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
            data: null,
            message: "Token đã được cập nhật"
          }
     
     } catch (error) {
       logger.error(error?.message);
            console.log(`Error in AuthService - method refreshToken at ${new Date().getTime} with message ${error?.message}`);
            return {
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              success: false,
              message: "Lỗi từ phía server",
              data: null,
              error: {
                message: "Lỗi từ phía server",
                errorDetail: error.message,
              }
            }
        }
    }

    async candidateLogin(userLogin: ILoginData, setTokensToCookie: (accessToken: string, refreshToken: string) => void): Promise<IResponseBase> {
    try {
          if (!userLogin.email || !userLogin.password) {
            return {
              status: StatusCodes.BAD_REQUEST,
              success: false,
              message: "Tài khoản và mật khẩu không được để trống",
              data: null,
              error: {
                message: "Bad Request",
                errorDetail: "Tài khoản và mật khẩu không được để trống",
              }
            }
          }

          const user = await this._context.UserRepo.findOne({
            where: { email: userLogin.email , roleName:VariableSystem.ROLE_NAME.CANDIDATE},
            
          })

            if(!user){
              return {
                  status: StatusCodes.NOT_FOUND,
                  success: false,
                  message: "Tài khoản không tồn tại",
                  data: null,
                  error: {
                    message: "Not Found",
                    errorDetail: "Tài khoản không tồn tại",
                  }
                }
            }

        const checkPass = await Extensions.comparePassword(userLogin.password, user.password);
          if (!checkPass) {
            return {
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Mật khẩu không chính xác",
              data: null,
              error: {
                message: "Unauthorized",
                errorDetail: "Mật khẩu không chính xác",
              },
            };
          }

          if (!user.isActive) {
            return {
              status: StatusCodes.FORBIDDEN,
              success: false,
              message: "Tài khoản của bạn đã bị khóa",
              data: null,
              error: {
                message: "Forbidden",
                errorDetail: "Tài khoản của bạn đã bị khóa",
              },
            };
          }

          const userRoles = await this._roleService.getCurrentUserPermission(user.id);
          if (!userRoles.success) {
            return userRoles;
          }
          const tokenPayload: ITokenPayload = {
            userId: user.id,
            userName: user.fullName,
            role: userRoles.data,
            roleName: user.roleName,
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
            data: null,
            error: null,
          };

          } catch (error) {
            logger.error(error?.message);
            console.log(`Error in AuthService - method login at ${new Date().getTime} with message ${error?.message}`);
            return {
              status: 500,
              success: false,
              message: "Lỗi từ phía server",
              data: null,
              error: {
                message: "Lỗi từ phía server",
                errorDetail: "Lỗi từ phía server",
              }
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
                data: null,
                error: {
                  message: "Bad Request",
                  errorDetail: "Tài khoản và mật khẩu không được để trống",
                }
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
                  data: null,
                  error: {
                    message: "Not Found",
                    errorDetail: "Tài khoản không tồn tại",
                  }
                }
            }
          const checkPass = await Extensions.comparePassword(userLogin.password, user.password);
            if (!checkPass) {
              return {
                status: StatusCodes.UNAUTHORIZED,
                success: false,
                message: "Mật khẩu không chính xác",
                data: null,
                error: {
                  message: "Unauthorized",
                  errorDetail: "Mật khẩu không chính xác",
                },
              };
            }
          if (!user.isActive) {
            return {
              status: StatusCodes.FORBIDDEN,
              success: false,
              message: "Tài khoản của bạn đã bị khóa",
              data: null,
              error: {
                message: "Forbidden",
                errorDetail: "Tài khoản của bạn đã bị khóa",
              },
            };
          }

          const userRoles = await this._roleService.getCurrentUserPermission(user.id);
          if (!userRoles.success) {
            return userRoles;
          }
    
          const tokenPayload: ITokenPayload = {
            userId: user.id,
            userName: user.fullName,
            role: userRoles.data,
            roleName: user.roleName,
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
            data: null,
            error: null,
          };

          } catch (error) {
            logger.error(error?.message);
            console.log(`Error in AuthService - method login at ${new Date().getTime} with message ${error?.message}`);
            return {
              status: 500,
              success: false,
              message: "Lỗi từ phía server",
              data: null,
              error: {
                message: "Lỗi từ phía server",
                errorDetail: error.message,
              }
            }
          }
    }
    async candidateRegister(candidateRegister: ICandidateRegisterData): Promise<IResponseBase> {
        try {
            if(!candidateRegister.email || !candidateRegister.fullName || !candidateRegister.password) {
              return {
                  status: StatusCodes.BAD_REQUEST,
                  success: false,
                  message: "Tài khoản, mật khẩu và họ tên không được để trống",
                  data: null,
                  error: {
                    message: "Bad Request",
                    errorDetail: "Tài khoản, mật khẩu và họ tên không được để trống",
                  }
                }
            }

            const checkEmail = await this._context.UserRepo.count({
              where: { email: candidateRegister.email }
            })

            if(checkEmail){
              return {
                  status: StatusCodes.CONFLICT,
                  success: false,
                  message: "Email đã tồn tại",
                  data: null,
                  error: {
                    message: "Bad Request",
                    errorDetail: "Tài khoản, mật khẩu và họ tên không được để trống",
                  }
                }
            }     

            const hashPassword = Extensions.hashPassword(candidateRegister.password);
            const registerData = {
              email: candidateRegister.email,
              fullName: candidateRegister.fullName,
              password: hashPassword,
              isActive:true,
              roleName: VariableSystem.ROLE_NAME.CANDIDATE
            }
            const newUser = await this._context.UserRepo.save(registerData);

            if (!newUser) {
              return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Đăng kí tài khoản không thành công, vui lòng kiểm tra lại",
                data: null,
                error: {
                  message: "Đăng kí tài khoản thất bại",
                  errorDetail: "Đăng kí tài khoản không thành công, vui lòng kiểm tra lại",
                },
              };
            }

            return {
              status: StatusCodes.CREATED,
              success: true,
              message: "Đăng kí tài khoản thành công",
              data:null,
              error: null,
            };
          } catch (error:any) {
              logger.error(error?.message);
              console.log(`Error in AuthService - method register at ${new Date().getTime()} with message ${error?.message}`);
              return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi từ phía server",
                data: null,
                error: {
                  message: "Lỗi từ phía server",
                  errorDetail: "Lỗi từ phía server",
                },
              };
        }
    }
    async companyRegister(companyRegister: ICompanyRegisterData): Promise<IResponseBase> {
      try {
            if(!companyRegister.email || !companyRegister.fullName || !companyRegister.password) {
              return {
                  status: StatusCodes.BAD_REQUEST,
                  success: false,
                  message: "Tài khoản, mật khẩu và họ tên không được để trống",
                  data: null,
                  error: {
                    message: "Bad Request",
                    errorDetail: "Tài khoản, mật khẩu và họ tên không được để trống",
                  }
                }
            }

            const checkEmail = await this._context.UserRepo.count({
              where: { email: companyRegister.email }
            })

            if(checkEmail){
              return {
                  status: StatusCodes.CONFLICT,
                  success: false,
                  message: "Email đăng kí đã tồn tại",
                  data: null,
                  error: {
                    message: "Bad Request",
                    errorDetail: "Email đăng kí đã tồn tại",
                  }
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
                message: "Đăng kí tài khoản nhà tuyển dụng không thành công, vui lòng kiểm tra lại",
                data: null,
                error: {
                  message: "Đăng kí tài khoản thất bại",
                  errorDetail: "Đăng kí tài khoản không thành công, vui lòng kiểm tra lại",
                },
              };
            }
            companyRegister.companyInfo.userId = newUser.id
            if(companyRegister.companyInfo){
                const result =  await this._companyService.createCompanyInfo(companyRegister.companyInfo)
                if(!result.success){
                  return {
                    status: result.status,
                    success: false,
                    message: result.message,
                    data: null,
                    error: result.error
                  }
                }
            }
            return {
              status: StatusCodes.CREATED,
              success: true,
              message: "Đăng kí tài khoản thành công",
              data:null,
              error: null,
            };
          } catch (error:any) {
              logger.error(error?.message);
              console.log(`Error in AuthService - method register at ${new Date().getTime()} with message ${error?.message}`);
              return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi từ phía server",
                data: null,
                error: {
                  message: "Lỗi từ phía server",
                  errorDetail:  error?.message || "Không rõ nguyên nhân.",
                },
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
              data: null,
              error: {
                message: "Unauthorized",
                errorDetail: "Không tìm thấy Id người dùng",
              },
            };
          }

        //   const user = await this._context.UserRepo.createQueryBuilder("user")
        //   .innerJoin("user.groupRole", "groupRole")
        //   .where("user.id = :userId", { userId })
        //   .select(["user", "groupRole.name", "groupRole.displayName"])
        //   .getOne();

        //   delete user?.password;
        //   delete user?.isDeleted;
        //   delete user?.updatedAt;
        //   delete user?.createdAt;
        //   delete user?.isVerifyEmail;

        //   if (!user) {
        //   return {
        //     status: StatusCodes.NOT_FOUND,
        //     success: false,
        //     message: "Không tìm thấy thông tin người dùng",
        //     data: null,
        //     error: {
        //       message: "Không tìm thấy thông tin người dùng",
        //       errorDetail: "Không tìm thấy thông tin người dùng",
        //     },
        //   };
        // }

        return {
        status: StatusCodes.OK,
        success: true,
        data: request?.user,
        error: null,
      };

      } catch (error:any) {
        logger.error(error?.message);
      console.log(`Error in AuthService - method getMe() at ${new Date().getTime} with message ${error?.message}`);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message,
        data: null,
        error: {
          message: "Lỗi từ phía server",
          errorDetail: "Lỗi từ phía server",
        },
      };
      }
    }  
}