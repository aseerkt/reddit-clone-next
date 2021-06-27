import { ValidationError } from 'class-validator';
import { FieldError } from '../types';

export const extractErrors = (errors: ValidationError[]): FieldError[] => {
  return errors.map(({ property, constraints }) => ({
    path: property,
    message: Object.values(constraints!)[0],
  }));
};
