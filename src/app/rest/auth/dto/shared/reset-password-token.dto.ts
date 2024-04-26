import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { FormatValidationException } from '@libs/decorators/format-validation-exception.decorator';
import { Match } from '@app/rest/users/dto/shared/create-user.dto';
export class ResetPasswordTokenDto {
  @IsNotEmpty()
  @IsNumberString()
  @FormatValidationException()
  token: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @FormatValidationException()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Match('new_password', {
    message: 'Password must match',
  })
  @FormatValidationException()
  password_confirmation: string;
}
