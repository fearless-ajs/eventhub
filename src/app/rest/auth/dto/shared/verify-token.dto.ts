import { FormatValidationException } from '@libs/decorators/format-validation-exception.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
} from 'class-validator';
export class VerifyTokenDto {
  // @IsNotEmpty()
  // @MaxLength(255)
  // @IsEmail()
  // @FormatValidationException()
  // email: string;

  @IsNotEmpty()
  @IsNumberString()
  @FormatValidationException()
  token: number;
}
