import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateWalletHistoryDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    walletId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsNotEmpty()
    @IsEnum(['deposit', 'withdraw'], {
        message: 'Type must be deposit or withdraw'
    })
    type: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    description: string;
}
