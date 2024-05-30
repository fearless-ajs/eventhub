import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  pricingPlanId: number;
}
