import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  isVerifyEmail: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  groupRoles?: number[];

  @IsBoolean()
  isSuperUser: boolean;

  @IsBoolean()
  isStaff: boolean;
}
