import { ValidationError } from 'class-validator';
import { FieldError } from '../types';

export const extractErrors = (errors: ValidationError[]) => {
  let fieldErrors: FieldError[] = [];
  errors.forEach(({ property, constraints }) => {
    fieldErrors.push({
      path: property,
      message: Object.values(constraints!)[0],
    });
  });
  return fieldErrors;
};
