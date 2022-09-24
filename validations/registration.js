import Joi from 'joi';
import { capitalizeLetter } from 'utils/helper';

export default function validateRegistration(values) {
  const validationSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    gender: Joi.string().required(),
    name: Joi.string().required(),
    photo: Joi.string().required(),
    password: Joi.string()
      .required()
      .pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/))
      .message({
        'string.pattern.base': 'Must contain 8 alphanumeric characters',
      }),
    confirm_password: Joi.any().equal(Joi.ref('password')).messages({
      'any.only': 'It must match with the above primary password',
    }),
  });

  const { error } = validationSchema.validate(values, { abortEarly: false });

  let errors = [];

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
