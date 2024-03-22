import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
export class AccountInfoDto {
  @IsNotEmpty()
  @IsString()
  @IsMobilePhone()
  system_number: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['trial', 'standard', 'essentials', 'premium'])
  plan: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  company: string;
}
