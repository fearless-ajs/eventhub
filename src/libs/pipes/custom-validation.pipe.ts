import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const validatorOptions: ValidatorOptions = {
      validationError: {
        target: false, // Exclude the object from the error message
      },
    };

    const object = plainToClass(metatype, value);
    const errors = await validate(object, validatorOptions);

    if (errors.length > 0) {
      throw new BadRequestException({
        status: 'VALIDATION_ERROR',
        errors: this.formatErrors(errors),
      });
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: any[]): any {
    const formattedErrors: any = {};

    errors.forEach((error) => {
      const { property, constraints } = error;

      if (formattedErrors[property]) {
        formattedErrors[property].push(...Object.values(constraints));
      } else {
        formattedErrors[property] = Object.values(constraints);
      }
    });

    return formattedErrors;
  }
}
