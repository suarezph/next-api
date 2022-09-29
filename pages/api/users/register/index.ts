import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { hashPassword } from 'lib/auth';
import validateRegistration, {
  RegistrationType,
} from 'validations/registration';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST')
    return response.status(500).json({
      success: false,
      message: `The HTTP ${request.method} method is not supported by this route.`,
    });

  let user = request.body as RegistrationType;
  delete user.files;

  const validate = validateRegistration(user);

  if (validate && validate.length > 0) {
    return response.status(422).json({
      success: false,
      errors: validate,
    });
  }

  user = {
    name: user.name,
    photo: user.photo,
    gender: user.gender,
    ...{
      email: user.email.toLowerCase(),
      password: await hashPassword(String(user.password)),
      // role: (<any>roles)[String(type).toUpperCase()],
    },
  };

  try {
    const userData = await prisma.user.create({
      data: { ...user },
      select: { email: true },
    });
    // if (!emailVerificationDisabled) await sendVerificationEmail(userData);
    // capturePosthogEvent(user.email, "user created");
    return response.json({ success: true, data: userData });
  } catch (e) {
    if (e.code === 'P2002') {
      return response.status(422).json({
        success: false,
        errors: [
          {
            email: 'Email address already exists',
          },
        ],
      });
    }

    return response.status(500).json({
      success: false,
      message: 'Internal esrver error: Please refresh and try again!',
      error: e.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
