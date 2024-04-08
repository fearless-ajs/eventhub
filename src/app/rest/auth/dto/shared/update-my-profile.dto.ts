import { IsOptional, IsString, MaxLength } from 'class-validator';
import { FormatValidationException } from '@libs/decorators/format-validation-exception.decorator';

export class UpdateMyProfileDto {
  @IsOptional()
  @MaxLength(255)
  @FormatValidationException()
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @FormatValidationException()
  lastname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @FormatValidationException()
  fcmDeviceToken?: string;

  @IsOptional()
  @FormatValidationException()
  picture: any;
}
