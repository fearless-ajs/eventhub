import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCartDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    pricingPlanId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}
