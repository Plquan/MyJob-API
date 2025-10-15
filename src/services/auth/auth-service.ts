import { ICandidateRegisterData, ICompanyRegisterData, ICurrentUser, ILoginData, IUserLoginResponse } from "@/dtos/auth/auth-dto";
import IAuthService from "@/interfaces/auth/auth-interface";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/database-service";
import { StatusCodes } from "http-status-codes";
import Extensions from "@/common/ultils/extension";
import logger from "@/common/helpers/logger";
import ICompanyService from "@/interfaces/company/company-interface";
import ICandidateService from "@/interfaces/candidate/candidate-interface";
import { IJwtService, ITokenPayload } from "@/interfaces/auth/jwt-interface";
import { EUserRole } from "@/common/enums/user/user-role-enum";
import { LoginRequest } from "@/dtos/auth/login-request";
import { HttpException } from "@/errors/http-exception";
import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { EAuthError } from "@/common/enums/error/EAuthError";



export default class AuthService implements IAuthService {
  private readonly _jwtService: IJwtService
  private readonly _context: DatabaseService
  private readonly _candidateService: ICandidateService
  private readonly _companyService: ICompanyService

  constructor(JwtService: IJwtService, CandidateService: ICandidateService, DatabaseService: DatabaseService, CompanyService: ICompanyService) {
    this._jwtService = JwtService;
    this._candidateService = CandidateService;
    this._context = DatabaseService;
    this._companyService = CompanyService
  }

  async refreshToken(oldRefreshToken: string, setTokensToCookie: (newAccessToken: string, newRefreshToken: string) => void): Promise<IResponseBase> {
    try {
      const isValid = this._jwtService.verifyRefreshToken(oldRefreshToken);
      const payload = this._jwtService.getTokenPayload(oldRefreshToken);

      if (!payload.tokenId || !payload.userId || !isValid)
        return {
          status: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Token không hợp lệ",
        }
      const tokenPayload: ITokenPayload = {
        userId: payload.userId,
        fullName: payload.fullName,
        roleName: payload.roleName,
        isStaff: payload.isStaff,
        isSuperUser: payload.isSuperUser,
        companyId: payload.companyId
      };
      const accessToken = this._jwtService.generateAccessToken(tokenPayload)
      const refreshToken = this._jwtService.generateRefreshToken(tokenPayload)
      const userRefreshToken = {
        id: refreshToken.tokenId,
        userId: payload.userId,
        revoked: false,
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAtUtc
      }
      await this._context.RefreshTokenRepo.delete({ id: payload.tokenId });
      await this._context.RefreshTokenRepo.save(userRefreshToken)
      setTokensToCookie(accessToken.token, refreshToken.token)

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
  async candidateLogin(loginRequest: LoginRequest, setTokensToCookie: (accessToken: string, refreshToken: string) => void): Promise<IResponseBase> {
    try {
      const user = await this._context.UserRepo.findOne({
        where: { email: loginRequest.email, roleName: EUserRole.CANDIDATE },
      })

      if (!user) {
        throw new HttpException(StatusCodes.NOT_FOUND, ErrorMessages.INVALID_CREDENTIALS)
      }

      const checkPass = await Extensions.comparePassword(loginRequest.password, user.password);
      if (!checkPass) {
        throw new HttpException(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_CREDENTIALS)
      }

      if (!user.isActive) {
        throw new HttpException(StatusCodes.FORBIDDEN, ErrorMessages.INVALID_CREDENTIALS)
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
        id: refreshToken.tokenId,
        userId: user.id,
        revoked: false,
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAtUtc
      }
      await this._context.RefreshTokenRepo.save(userRefreshToken)
      setTokensToCookie(accessToken.token, refreshToken.token)
      return {
        status: 200,
        success: true,
        message: "Đăng nhập thành công"
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
  async companyLogin(loginRequest: LoginRequest, setTokensToCookie: (accessToken: string, refreshToken: string) => void): Promise<IResponseBase> {
    try {
      const user = await this._context.UserRepo.findOne({
        where: { email: loginRequest.email, roleName: EUserRole.EMPLOYER },
        relations: ['company']
      })

      if (!user) {
        throw new HttpException(StatusCodes.NOT_FOUND, ErrorMessages.INVALID_CREDENTIALS)
      }
      const checkPass = await Extensions.comparePassword(loginRequest.password, user.password);
      if (!checkPass) {
        throw new HttpException(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_CREDENTIALS)
      }
      if (!user.isActive) {
        throw new HttpException(StatusCodes.FORBIDDEN, ErrorMessages.INVALID_CREDENTIALS)
      }

      const tokenPayload: ITokenPayload = {
        userId: user.id,
        fullName: user.fullName,
        roleName: user.roleName,
        isStaff: user.isStaff,
        isSuperUser: user.isSuperUser,
        companyId: user.company.id,
      };

      const accessToken = this._jwtService.generateAccessToken(tokenPayload)
      const refreshToken = this._jwtService.generateRefreshToken(tokenPayload)
      const userRefreshToken = {
        id: refreshToken.tokenId,
        userId: user.id,
        revoked: false,
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAtUtc
      }
      await this._context.RefreshTokenRepo.save(userRefreshToken)
      setTokensToCookie(accessToken.token, refreshToken.token)

      return {
        status: 200,
        success: true,
        message: "Đăng nhập thành công",
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
      throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.InvalidInput.toString())
    }

    const checkEmail = await this._context.UserRepo.count({
      where: { email: candidateRegister.email },
    });

    if (checkEmail) {
      throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ConflictError.toString())
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
          roleName: EUserRole.CANDIDATE,
        }))

        const profileResult = await this._candidateService.createProfile(newUser, manager)
        if (!profileResult.success) {
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.CreateFailed.toString())
        }
      })

      return {
        status: StatusCodes.CREATED,
        success: true,
        message: "Đăng kí tài khoản thành công",
      }
    } catch (error: any) {
      console.log(`Error in AuthService - candidateRegister transaction: ${error?.message}`);
      throw error;
    }
  }
  async companyRegister(companyRegister: ICompanyRegisterData): Promise<boolean> {
    try {
      const checkEmail = await this._context.UserRepo.count({
        where: { email: companyRegister.email }
      })

      if (checkEmail) {
        throw new HttpException(StatusCodes.CONFLICT, EAuthError.UserAlreadyExists.toString())
      }
      const hashPassword = Extensions.hashPassword(companyRegister.password);
      const registerData = {
        email: companyRegister.email,
        fullName: companyRegister.fullName,
        password: hashPassword,
        isActive: true,
        roleName: EUserRole.EMPLOYER,
      }
      const newUser = await this._context.UserRepo.save(registerData);
      if (!newUser) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.CreateFailed.toString())
      }
      companyRegister.companyInfo.userId = newUser.id
      if (companyRegister.companyInfo) {
        await this._companyService.createCompanyInfo(companyRegister.companyInfo)
      }
      return true
    } catch (error) {
      logger.error(error?.message);
      console.log(`Error in AuthService - method register at ${new Date().getTime()} with message ${error?.message}`);
    }
  }
  async getMe(): Promise<IResponseBase> {
    try {
      const userId = getCurrentUser().id

      const user = await this._context.UserRepo.findOne({
        where: {
          id: userId,
        },
        relations: {
          candidate: true,
          company: true,
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
        avatar: user.avatar?.url,
        companyId: user.company.id,
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

    } catch (error: any) {
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