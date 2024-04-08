import { IsDateAfter, IsFutureDate } from "@libs/decorators/date-validator.decorator";
import { FormatValidationException } from "@libs/decorators/format-validation-exception.decorator";
import { IsBoolean, IsDateString, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";

export class CreateEventFeedDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @FormatValidationException()
    title: string;

    @IsNotEmpty()
    @IsEnum(['upcoming', 'ongoing', 'past'], {
        message: 'Event category must be either upcoming, ongoing or past'
      })
    @FormatValidationException()
    category: string;

    @IsNotEmpty()
    @IsDateString()
    @IsFutureDate()
    @FormatValidationException()
    startDateTime: Date;

    @IsNotEmpty()
    @IsDateString()
    @IsDateAfter('startDateTime')
    @FormatValidationException()
    endDateTime: Date;

    @IsNotEmpty()
    @IsString()
    @MaxLength(4000)
    @FormatValidationException()
    description: string;

    @IsNotEmpty()
    @IsEnum(['paid', 'free'], {
        message: 'Event type must be either paid or free'
    })
    type: string;

    @IsNotEmpty()
    @IsNumber()
    @IsDefined()
    @ValidateIf((object) => object.type === 'paid')
    @FormatValidationException()
    price: number;

    @IsNotEmpty()
    @IsEnum(['limited', 'unlimited'], {
        message: 'Expected audience must be either limited or unlimited'
    })
    @FormatValidationException()
    expectedAudience: string;

    @IsNotEmpty()
    @IsNumber()
    @IsDefined()
    @ValidateIf((object) => object.expectedAudience === 'limited')
    audienceLimit: number;

    @IsNotEmpty()
    @IsDateString()
    @IsFutureDate()
    @FormatValidationException()
    registrationDeadline: Date;

    @IsOptional()
    @IsDefined()
    @IsBoolean()
    @FormatValidationException()
    expectsDresscode: boolean;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @ValidateIf((object) => object.expectsDresscode)
    @FormatValidationException()
    dresscode: string;
}
