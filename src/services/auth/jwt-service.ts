import { ENV } from "@/common/constants/env";
import { IJwtService, ITokenPayload, ITokenResponse } from "@/interfaces/auth/jwt-interface"
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export default class JwtService implements IJwtService {
  private accessTokenSecret!: string;
  private accessTokenExpriedIn!: number;
  private refreshTokenSecret!: string;
  private refreshTokenExpriedIn!: number;

  constructor() {
    this.accessTokenSecret = String(ENV.ACCESS_TOKEN_SECRET);
    this.accessTokenExpriedIn = Number(ENV.ACCESS_TOKEN_EXPIRES_IN);
    this.refreshTokenSecret = String(ENV.REFRESH_TOKEN_SECRET)
    this.refreshTokenExpriedIn = Number(ENV.REFRESH_TOKEN_EXPIRES_IN)
  }

    generateRefreshToken(payload: ITokenPayload): ITokenResponse {
      const tokenId = uuidv4();
      payload.tokenId = tokenId
      const token = jwt.sign({ isCredential: true, ...payload }, this.refreshTokenSecret, {
        expiresIn: this.refreshTokenExpriedIn,
      });

      const expiresAt = new Date(Date.now() + this.refreshTokenExpriedIn * 1000);

      return {
        tokenId,
        token,
        expiresAtUtc: expiresAt,
      };
      
    }

    verifyRefreshToken(token: string): boolean {
        try {
        jwt.verify(token, this.refreshTokenSecret);
        return true;
      } catch {
        return false;
      }
    }

    generateAccessToken(payload: ITokenPayload): ITokenResponse {
      const tokenId = uuidv4();
      payload.tokenId = tokenId
      const token = jwt.sign({ isCredential: true, ...payload }, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpriedIn,
      });

      const expiresAt = new Date(Date.now() + this.accessTokenExpriedIn * 1000);

      return {
        tokenId,
        token,
        expiresAtUtc: expiresAt,
      };
    }

  verifyAccessToken(token: string): boolean {
    try {
      jwt.verify(token, this.accessTokenSecret);
      return true;
    } catch {
      return false;
    }
  }
  
  getTokenPayload(token: string):ITokenPayload {
    return jwt.decode(token) as ITokenPayload;
  }

  getTokenHeader(token: string) {
    const header = jwt.decode(token, { complete: true })?.header;
    return header;
  }
}