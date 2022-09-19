import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { hashPassword } from '../../../../lib/auth';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST')
    throw new Error(
      `The HTTP ${request.method} method is not supported by this route.`,
    );

  let user = request.body;

  user = {
    ...user,
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
      return response.status(409).json({
        success: false,
        error: 'Email address already exists',
        errorCode: e.code,
      });
    }

    return response.status(500).json({
      success: false,
      error: e.message,
      errorCode: e.code,
    });
  }
}
