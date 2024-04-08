import { CustomValidation } from "@libs/decorators/custom-validation.decorator";
import { IsBoolean, IsDateString, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";

export class CreateEventFeedDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @CustomValidation()
    title: string;

    @IsNotEmpty()
    @IsEnum(['upcoming', 'ongoing', 'past'], {
        message: 'Event category must be either upcoming, ongoing or past'
      })
    @CustomValidation()
    category: string;

    @IsNotEmpty()
    @IsDateString()
    @CustomValidation()
    startDateTime: Date;

    @IsNotEmpty()
    @IsDateString()
    @CustomValidation()
    endDateTime: Date;

    @IsNotEmpty()
    @IsString()
    @MaxLength(4000)
    @CustomValidation()
    description: string;

    @IsNotEmpty()
    @IsEnum(['paid', 'free'], {
        message: 'Event type must be either paid or free'
    })
    type: string;

    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    @IsDefined()
    @ValidateIf((object) => object.type === 'paid')
    @CustomValidation()
    price: number;

    @IsNotEmpty()
    @IsEnum(['limited', 'unlimited'], {
        message: 'Expected audience must be either limited or unlimited'
    })
    @CustomValidation()
    expectedAudience: string;

    @IsOptional()
    @IsNumber()
    @IsDefined()
    @ValidateIf((object) => object.expectedAudience === 'limited')
    audienceLimit: number;

    @IsNotEmpty()
    @IsDateString()
    @CustomValidation()
    registrationDeadline: Date;

    @IsOptional()
    @IsDefined()
    @IsBoolean()
    @CustomValidation()
    expectsDresscode: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @ValidateIf((object) => object.expectsDresscode)
    dresscode: string;
}
