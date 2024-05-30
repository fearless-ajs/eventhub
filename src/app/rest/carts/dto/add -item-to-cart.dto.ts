import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class AddItemToCartDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    pricingPlanId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}
