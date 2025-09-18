export interface ITokenPayload {
    userId: number
    tokenId?:string
    fullName: string
    roleName: string
    isStaff: boolean
    isSuperUser: boolean
    companyId?: number
  }

  export interface ITokenResponse {
    tokenId:string
    token: string
    expiresAtUtc: Date
  }
  export interface IRefreshToken {
    id: string;
    token: string;
    expiresAt: Date;
    revoked: boolean;
  }

  export interface IJwtService {
    generateAccessToken(payload: ITokenPayload): ITokenResponse
    generateRefreshToken(payload: ITokenPayload):ITokenResponse
    verifyAccessToken(token: string): boolean
    verifyRefreshToken(token: string): boolean
    getTokenPayload(token: string): ITokenPayload
    getTokenHeader(token: string): any
  }