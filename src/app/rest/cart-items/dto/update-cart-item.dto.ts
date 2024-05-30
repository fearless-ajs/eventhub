import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart-item.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsEnum(['add', 'subtract'], {
    message: 'Type must be add or subtract'
  })
  type: string;
}
