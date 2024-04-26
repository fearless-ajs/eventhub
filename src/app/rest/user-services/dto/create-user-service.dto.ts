import { FormatValidationException } from "@libs/decorators/format-validation-exception.decorator";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsPositive, IsString, MaxLength, ValidateNested } from "class-validator";

export class PricePlanDto {
    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    // @FormatValidationException()
    item: string;
  
    @IsNotEmpty()
    @IsString()
    @IsNumber()
    @IsPositive()
    // @FormatValidationException()
    amount: number;
  }


export class CreateUserServiceDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @FormatValidationException()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(4000)
    @FormatValidationException()
    description: string;

    @IsNotEmpty()
    @IsEnum(['rental', 'security', 'logistic', 'decor/design'], {
        message: 'Event category must be either rental, security, logistic or decor/design'
      })
    @FormatValidationException()
    category: string;
  
    @IsNotEmpty()
    @IsArray({ message: 'Price plans must be an array'})
    //@IsObject({ each: true, message: 'Each price plan must be an object'})
    @Type(() => PricePlanDto)
    //@ValidateNested({ each: true, message: 'Each price plan must be an object'})
    //@FormatValidationException()
    pricePlans: PricePlanDto[];

    @IsOptional()
    // @Matches(/\.jpe?g|\.png$/i, { message: 'Only JPEG and PNG files are allowed' })
    /*  @IsFile({ message: 'Data must be a file' })*/
    @FormatValidationException()
    images: any[];

}
