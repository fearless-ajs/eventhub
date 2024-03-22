import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { CustomValidation } from '@libs/decorators/custom-validation.decorator';
import { Match } from '@app/rest/users/dto/shared/create-user.dto';
export class ResetPasswordTokenDto {
  @IsNotEmpty()
  @IsNumberString()
  token: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @CustomValidation()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Match('new_password', {
    message: 'Password must match',
  })
  password_confirmation: string;
}
