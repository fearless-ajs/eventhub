import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class RemoveCartItemDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    pricingPlanId: number;
}
