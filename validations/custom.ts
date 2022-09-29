import { ValidationError } from 'joi';
import { capitalizeLetter } from 'utils/helper';

export type ErrorType = {
  [key: string]: string;
};

export default function CustomError(error: ValidationError) {
  let errors: ErrorType[] = [];

  if (error) {
    error.details.map(item => {
      errors.push({
        [`${item?.context?.key}`]: capitalizeLetter(
          item.message.replace(/"/g, ''),
        ),
      });
    });
  }

  return errors;
}
