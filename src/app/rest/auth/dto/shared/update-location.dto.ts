import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { CustomValidation } from '@libs/decorators/custom-validation.decorator';
export class UpdateLocationDto {
  @IsNotEmpty()
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  @CustomValidation()
  latitude?: number;

  @IsNotEmpty()
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  @CustomValidation()
  longitude?: number;
}
