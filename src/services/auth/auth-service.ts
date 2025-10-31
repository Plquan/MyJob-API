import { ICandidateRegisterData, ICompanyRegisterData, ICurrentUser } from "@/dtos/auth/auth-dto";
import IAuthService from "@/interfaces/auth/auth-interface";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/database-service";
import Extensions from "@/common/ultils/extension";
import logger from "@/common/helpers/logger";
import { IJwtService, ITokenPayload } from "@/interfaces/auth/jwt-interface";
import { EUserRole } from "@/common/enums/user/user-role-enum";
import { LoginRequest } from "@/dtos/auth/login-request";
import { HttpException } from "@/errors/http-exception";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EResumeType } from "@/common/enums/resume/resume-enum";
import { Company } from "@/entities/company";
import { User } from "@/entities/user";

export default class AuthService implements IAuthService {
  private readonly _jwtService: IJwtService
  private readonly _context: DatabaseService
  constructor(JwtService: IJwtService, DatabaseService: DatabaseService) {
    this._jwtService = JwtService;
    this._context = DatabaseService;
  }

  async refreshToken(oldRefreshToken: string, setTokenToCookie: (newRefreshToken: string) => void): Promise<string> {
    try {
      const isValid = this._jwtService.verifyRefreshToken(oldRefreshToken);
      const payload = this._jwtService.getTokenPayload(oldRefreshToken);

      if (!payload.tokenId || !payload.userId || !isValid) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EAuthError.TokenGenerationFailed, "Invalid token")
      }

      delete (payload as any).exp;
      delete (payload as any).iat;

      const accessToken = this._jwtService.generateAccessToken(payload)
      const refreshToken = this._jwtService.generateRefreshToken(payload)
      const userRefreshToken = {
        id: refreshToken.tokenId,
        userId: payload.userId,
        revoked: false,
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAtUtc
      }
      await this._context.RefreshTokenRepo.delete({ id: payload.tokenId });
      await this._context.RefreshTokenRepo.save(userRefreshToken)
      setTokenToCookie(refreshToken.token)
      return accessToken.token
    } catch (error) {
      logger.error(error?.message);
      console.log(`Error in AuthService - method refreshToken with message ${error?.message}`);
      throw error;
    }
  }
  async candidateLogin(loginRequest: LoginRequest, setTokensToCookie: (refreshToken: string) => void): Promise<string> {
    try {
      const user = await this._context.UserRepo.findOne({
        where: { email: loginRequest.email, roleName: EUserRole.CANDIDATE },
        relations: ['candidate']
      })

      if (!user) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "User not found")
      }

      const checkPass = await Extensions.comparePassword(loginRequest.password, user.password);
      if (!checkPass) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EAuthError.InvalidPassword, "Invalid password")
      }

      if (!user.isActive) {
        throw new HttpException(StatusCodes.FORBIDDEN, EAuthError.UserInactive, "User inactive")
      }

      const tokenPayload: ITokenPayload = {
        userId: user.id,
        fullName: user.fullName,
        roleName: user.roleName,
        isStaff: user.isStaff,
        isSuperUser: user.isSuperUser,
        candidateId: user.candidate.id
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
      setTokensToCookie(refreshToken.token)
      return accessToken.token

    } catch (error) {
      logger.error(error?.message);
      console.log(`Error in AuthService - method candidateLogin  with message ${error?.message}`);
      throw error
    }
  }
  async candidateRegister(candidateRegister: ICandidateRegisterData): Promise<boolean> {
    if (!candidateRegister.email || !candidateRegister.fullName || !candidateRegister.password) {
      throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Invalid input")
    }
    const checkEmail = await this._context.UserRepo.count({
      where: { email: candidateRegister.email },
    });

    if (checkEmail) {
      throw new HttpException(StatusCodes.CONFLICT, EGlobalError.ConflictError, "Email existed")
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
        const newCandidateProfile = await manager.save(
          this._context.CandidateRepo.create({ user: newUser })
        );
        await manager.save(
          this._context.ResumeRepo.create({
            candidate: newCandidateProfile,
            selected: true,
            type: EResumeType.ONLINE,
          })
        )
      })
      return true
    } catch (error: any) {
      console.log(`Error in AuthService - candidateRegister transaction: ${error?.message}`);
      throw error;
    }
  }
  async employerLogin(loginRequest: LoginRequest, setTokensToCookie: (refreshToken: string) => void): Promise<string> {
    try {
      const user = await this._context.UserRepo.findOne({
        where: { email: loginRequest.email, roleName: EUserRole.EMPLOYER },
        relations: ['company']
      })

      if (!user) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Employer not found")
      }

      const checkPass = await Extensions.comparePassword(loginRequest.password, user.password);
      if (!checkPass) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EAuthError.InvalidPassword, "Invalid password")
      }

      if (!user.isActive) {
        throw new HttpException(StatusCodes.FORBIDDEN, EAuthError.UserInactive, "Employer inactive")
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
      setTokensToCookie(refreshToken.token)

      return accessToken.token
    } catch (error) {
      logger.error(error?.message);
      console.log(`Error in AuthService - method login() at ${new Date().getTime} with message ${error?.message}`);
      throw error
    }
  }
  async employerRegister(companyRegister: ICompanyRegisterData): Promise<boolean> {
    const dataSource = this._context.getDataSource();
    try {
      return await dataSource.transaction(async (manager) => {
        const checkEmail = await manager.count(User, {
          where: { email: companyRegister.email }
        });
        if (checkEmail) {
          throw new HttpException(StatusCodes.CONFLICT, EAuthError.UserAlreadyExists, "Email existed");
        }

        const hashPassword = Extensions.hashPassword(companyRegister.password);

        const newUser = manager.create(User, {
          email: companyRegister.email,
          fullName: companyRegister.fullName,
          password: hashPassword,
          isActive: true,
          roleName: EUserRole.EMPLOYER,
        });

        await manager.save(User, newUser);
        companyRegister.companyInfo.userId = newUser.id;
        const companyInfo = manager.create(Company, companyRegister.companyInfo);
        await manager.save(Company, companyInfo);
        return true;
      });
    } catch (error: any) {
      logger.error(error?.message);
      console.log(`Error in AuthService - employerRegister: ${error?.message}`);
      throw error;
    }
  }
  async getMe(): Promise<ICurrentUser> {
    try {
      const userId = getCurrentUser().id
      if (!userId) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "User id not found");
      }

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
        companyId: user?.company?.id,
      }

      if (!user) {
       throw new HttpException(StatusCodes.NOT_FOUND,EAuthError.UserNotFound,"User not found")
      }
      return currentUser
    } catch (error: any) {
      logger.error(error?.message);
      console.log(`Error in AuthService - method getMe()  with message ${error?.message}`);
      throw error
    }
  }
}