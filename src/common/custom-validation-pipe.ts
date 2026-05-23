/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);

        const errors = await validate(object);

        if (errors.length > 0) {
            this.formatError(errors);
        }
        return value;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    private toValidate(metatype: Function): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private formatError(errors: ValidationError[]): any {
        const formattedErrors = errors.reduce((acc, error) => {
            if (error.children && error.children.length > 0) {
                acc[error.property] = this.formatError(error.children);
                return acc;
            } else {
                acc[error.property] = Object.values(error.constraints)[0];
                return acc;
            }
        }, {});

        throw new BadRequestException({ message: formattedErrors, code: 400 });
    }
}
