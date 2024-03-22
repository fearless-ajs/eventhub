import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CustomValidation } from '@libs/decorators/custom-validation.decorator';

export class OnboardingDto {
  /* GUEST RELATED ONBOARDING DATA */
  @IsOptional()
  @IsArray({ message: 'Invitation types must be an array' })
  @IsNotEmpty({
    each: true,
    message: 'No element in the array should be empty',
  })
  @IsString({ each: true, message: 'Each element in names must be a string' })
  @MaxLength(255, {
    each: true,
    message: 'Each element in names must not exceed 255 characters',
  })
  @CustomValidation()
  userGuestInvitationTypes: string[];

  @IsOptional()
  @IsArray({ message: 'Invitation types must be an array' })
  @IsNotEmpty({
    each: true,
    message: 'No element in the array should be empty',
  })
  @IsString({ each: true, message: 'Each element in names must be a string' })
  @MaxLength(255, {
    each: true,
    message: 'Each element in names must not exceed 255 characters',
  })
  @CustomValidation()
  userGuestOutingPeriods: string[];
  /* END GUEST RELATED ONBOARDING DATA */

  /* HOST RELATED ONBOARDING DATA */
  @IsOptional()
  @IsArray({ message: 'Invitation types must be an array' })
  @IsNotEmpty({
    each: true,
    message: 'No element in the array should be empty',
  })
  @IsString({ each: true, message: 'Each element in names must be a string' })
  @MaxLength(255, {
    each: true,
    message: 'Each element in names must not exceed 255 characters',
  })
  @CustomValidation()
  userHostInviteeTypes: string[];
  /* END HOST RELATED ONBOARDING DATA */

  /* SHARED ONBOARDING DATA */
  @IsOptional()
  @IsEnum(['male', 'female'], {
    message: 'gender must be one of the following values: male, female',
  })
  @CustomValidation()
  gender: string;

  @IsNotEmpty()
  @IsArray({ message: 'Invitation types must be an array' })
  @IsNotEmpty({
    each: true,
    message: 'No element in the array should be empty',
  })
  @IsString({ each: true, message: 'Each element in names must be a string' })
  @MaxLength(255, {
    each: true,
    message: 'Each element in names must not exceed 255 characters',
  })
  @CustomValidation()
  userEventStyles: string[];

  @IsNotEmpty()
  @IsArray({ message: 'Invitation types must be an array' })
  @IsNotEmpty({
    each: true,
    message: 'No element in the array should be empty',
  })
  @IsString({ each: true, message: 'Each element in names must be a string' })
  @MaxLength(255, {
    each: true,
    message: 'Each element in names must not exceed 255 characters',
  })
  @CustomValidation()
  userLocationGenres: string[];

  // @IsNotEmpty({ message: 'Data should not be empty' })
  @IsOptional()
  // @Matches(/\.jpe?g|\.png$/i, { message: 'Only JPEG and PNG files are allowed' })
  /*  @IsFile({ message: 'Data must be a file' })*/
  @CustomValidation()
  userMedia: any[];
  /* END SHARED ONBOARDING DATA */
}
