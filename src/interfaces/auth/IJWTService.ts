export interface ITokenPayload {
    userId: number;
    userName: string;
    role: string;
    roleName: string;
  }
  export interface IAccessTokenResponse {
    token: string;
    expiresAt: Date;
    expiresAtUtc: string;
  }

export interface IRefreshTokenResponse {
  token: string;
  expiresAt: Date;
  expiresAtUtc: string;
}
  export interface IJWTService {
    generateAccessToken(payload: ITokenPayload): IAccessTokenResponse
    generateRefreshToken(payload: ITokenPayload):IRefreshTokenResponse
    verifyAccessToken(token: string): boolean
    verifyRefreshToken(token: string): boolean
    getTokenPayload(token: string): any
    getTokenHeader(token: string): any
  }