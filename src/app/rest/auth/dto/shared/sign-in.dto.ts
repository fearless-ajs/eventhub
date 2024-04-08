import { FormatValidationException } from '@libs/decorators/format-validation-exception.decorator';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @FormatValidationException()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @FormatValidationException()
  password: string;
}
