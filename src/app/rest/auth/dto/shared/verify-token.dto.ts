import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
} from 'class-validator';
export class VerifyTokenDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  token: number;
}
