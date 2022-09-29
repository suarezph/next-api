import Joi, { ValidationError } from 'joi';
import { capitalizeLetter } from 'utils/helper';
import CustomError from './custom';

export type RegistrationType = {
  email: string;
  gender: string;
  name: string;
  photo: string;
  password: string;
  confirm_password?: string;
  files?: string;
};

export type ErrorType = {
  [key: string]: string;
};

export default function validateRegistration(values: RegistrationType) {
  const validationSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    gender: Joi.string().required(),
    name: Joi.string().required(),
    photo: Joi.string().required(),
    password: Joi.string()
      .required()
      .regex(new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/))
      .messages({
        'any.regex.base': 'Must contain 8 alphanumeric characters' || undefined,
      }),
    confirm_password: Joi.required().equal(Joi.ref('password')).messages({
      'any.only': 'It must match with the above primary password',
    }),
  });

  const { error } = validationSchema.validate(values, { abortEarly: false });

  return CustomError(error as ValidationError);
}
