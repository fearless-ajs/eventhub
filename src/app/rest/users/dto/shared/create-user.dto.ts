import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FormatValidationException } from '@libs/decorators/format-validation-exception.decorator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  @FormatValidationException()
  email: string;

  @IsString()
  @MaxLength(255)
  @FormatValidationException()
  firstname: string;

  @IsString()
  @MaxLength(255)
  @FormatValidationException()
  lastname: string;

  @MaxLength(100)
  @FormatValidationException()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Match('password', {
    message: 'Password must match',
  })
  @FormatValidationException()
  passwordConfirmation: string;
}
