export interface ITokenPayload {
    userId: number;
    tokenId?:string,
    userName: string;
    role: string;
    roleName: string;
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

  export interface IJWTService {
    generateAccessToken(payload: ITokenPayload): ITokenResponse
    generateRefreshToken(payload: ITokenPayload):ITokenResponse
    verifyAccessToken(token: string): boolean
    verifyRefreshToken(token: string): boolean
    getTokenPayload(token: string): ITokenPayload
    getTokenHeader(token: string): any
  }