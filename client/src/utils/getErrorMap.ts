import { FieldError } from '../generated/graphql';

export const getErrorMap = (errors: FieldError[]) => {
  const errorMap = errors.reduce((prev, curr) => {
    prev[curr.path] = curr.message;
    return prev;
  }, {});
  console.log(errorMap);
  return errorMap;
};
