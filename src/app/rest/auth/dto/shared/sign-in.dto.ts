import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  password: string;
}
