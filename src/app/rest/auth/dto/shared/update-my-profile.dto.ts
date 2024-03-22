import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CustomValidation } from '@libs/decorators/custom-validation.decorator';

export class UpdateMyProfileDto {
  @IsOptional()
  @MaxLength(255)
  @CustomValidation()
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @CustomValidation()
  lastname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @CustomValidation()
  fcmDeviceToken?: string;

  @IsOptional()
  @CustomValidation()
  picture: any;
}
