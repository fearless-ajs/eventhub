import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { FormatValidationException } from '@libs/decorators/format-validation-exception.decorator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @FormatValidationException()
  balance: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @FormatValidationException()
  description: string;
}
